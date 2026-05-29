export default function HabitDetailLoading() {
  return (
    <div className="max-w-5xl w-full space-y-4">
      <div className="skeleton rounded-xl h-20" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton rounded-xl h-24" />
        ))}
      </div>
      <div className="skeleton rounded-xl h-52" />
    </div>
  );
}
