import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div>
      <h1>Playground</h1>
      <nav style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
        <Link to='/trpc'>tRPC</Link>
        <Link to='/sse'>Server Sent Event</Link>
        <Link to='/apollo'>Apollo</Link>
      </nav>
    </div>
  );
};

