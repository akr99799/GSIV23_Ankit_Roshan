interface Props {
  message: string;
}

export default function EmptyPage({ message }: Props) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>{message}</p>
    </div>
  );
}
