// Shared small utilities or components used across the app

export const Placeholder = ({ children }: { children?: React.ReactNode }) => {
  return <div>{children ?? 'placeholder'}</div>;
};
