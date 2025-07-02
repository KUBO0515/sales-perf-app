// pages/TestFirebase.tsx
import { useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function TestFirebase() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const snapshot = await getDocs(collection(db, "test"));
        console.log("✅ Firebase 接続成功！ドキュメント数:", snapshot.size);
        snapshot.forEach((doc) => {
          console.log("📄 データ:", doc.id, doc.data());
        });
      } catch (error) {
        console.error("❌ Firebase 接続エラー:", error);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Firebase 接続テスト</h1>
      <p>ブラウザのコンソールに接続結果が表示されます。</p>
    </div>
  );
}
