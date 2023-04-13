interface AppProps<P = {}> {
  Component: React.ComponentType<P>;
  props: P;
}

export const App = ({ Component, props }: AppProps) => {
  return (
    <>
      <p>App Component</p>
      <Component {...props} />
    </>
  );
};
