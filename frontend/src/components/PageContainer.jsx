function PageContainer({
  title,
  children,
}) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {title}
      </h1>

      {children}
    </div>
  );
}

export default PageContainer;