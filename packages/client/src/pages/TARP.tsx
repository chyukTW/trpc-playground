import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient, tarpClient } from '../client';
import { tarp } from '../tarp';

const Missions = () => {
  const response = tarp.missions.useQuery();

  return (
    <div>
      <h1>Missions</h1>
      <ul>
        {
          response?.data?.map(({id})=> {
            return <li key={id}>{id}</li>;
          })
        }
      </ul>
    </div>
  );
};

export const TARP = () => {  
  const client = tarpClient();

  return (
    <tarp.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Missions />
      </QueryClientProvider>
    </tarp.Provider>   
  );
};
