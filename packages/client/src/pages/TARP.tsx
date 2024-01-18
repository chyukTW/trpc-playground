import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { queryClient, tarpClient } from '../client';
import { tarp } from '../tarp';

const Missions = () => {
  const [start, setStart] = useState<string>();
  const [end, setEnd] = useState<string>();
  const [limit, setLimit] = useState<number>();
  const [offset, setOffset] = useState<number>();

  const response = tarp.missions.useQuery({ end: start ? end: undefined, limit: limit || 10, offset, start: end ? start : undefined });

  return (
    <div>
      <h1>Missions</h1>
      <div>
        limit: <input min={1} onChange={(e)=> setLimit(Number(e.target.value))} type='number'/>
        offset: <input min={1} onChange={(e)=> setOffset(Number(e.target.value))} type='number'/>
      </div>
      <div>
        start: <input onChange={(e) => setStart(new Date(e.target.value).toISOString())} type='date'/>
        {' / '}
        end: <input onChange={(e) => setEnd(new Date(e.target.value).toISOString())} type='date'/>
      </div>
      <ul>
        {
          response?.data?.map(({date, id})=> {
            return (
              <li key={id}>
                <div>
                  <p>{date}</p>
                  <p>{id}</p>
                </div>
              </li>
            );
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
