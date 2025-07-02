import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { stringify } from 'csv-stringify/sync'

admin.initializeApp()
const db = admin.firestore()
const storage = admin.storage().bucket()

export const hourlyAggregate = functions.pubsub
  .schedule('every 60 minutes')
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now()
    const hourAgo = admin.firestore.Timestamp.fromMillis(
      now.toMillis() - 60 * 60 * 1000
    )
    const snapshot = await db
      .collection('records')
      .where('createdAt', '>', hourAgo)
      .get()
    // Aggregate
    const totals: Record<string, number> = {}
    snapshot.forEach((doc) => {
      const { ownerUid, amount = 0 } = doc.data()
      totals[ownerUid] = (totals[ownerUid] || 0) + amount
    })
    await db
      .collection('aggregates')
      .doc(`company_${now.toDate().toISOString().slice(0, 13)}`)
      .set({
        scope: 'company',
        totals,
        periodKey: now.toDate().toISOString().slice(0, 13),
        updatedAt: now,
      })
  })

export const exportCsv = functions.https.onCall(async (_, context) => {
  if (!context.auth?.token || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Admin only')
  }
  const aggSnap = await db
    .collection('aggregates')
    .orderBy('periodKey', 'desc')
    .limit(1)
    .get()
  if (aggSnap.empty) {
    return ''
  }
  const data = aggSnap.docs[0].data().totals
  const csv = stringify(Object.entries(data), { header: false })
  const filename = `exports/export_${Date.now()}.csv`
  await storage.file(filename).save(csv, { contentType: 'text/csv' })
  const [url] = await storage
    .file(filename)
    .getSignedUrl({ action: 'read', expires: Date.now() + 3600 * 1000 })
  return url
})
