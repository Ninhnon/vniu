export default async function layout({ children }) {
  return (
    <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden">
      <div className="w-full">{children}</div>
    </div>
  );
}
