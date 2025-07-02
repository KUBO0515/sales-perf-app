import { useForm } from "react-hook-form";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

interface Inputs {
  count: number;
  amount: number;
}

export default function RecordForm() {
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    if (!auth.currentUser) return;
    await addDoc(collection(db, "records"), {
      ownerUid: auth.currentUser.uid,
      ...data,
      createdAt: serverTimestamp(),
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-[300px]">
      <div>
        <label className="block text-sm">Count</label>
        <input
          type="number"
          {...register("count", { valueAsNumber: true })}
          className="input w-full"
        />
      </div>
      <div>
        <label className="block text-sm">Amount</label>
        <input
          type="number"
          {...register("amount", { valueAsNumber: true })}
          className="input w-full"
        />
      </div>
      <button type="submit" className="btn btn-primary w-full">
        Save
      </button>
    </form>
  );
}
