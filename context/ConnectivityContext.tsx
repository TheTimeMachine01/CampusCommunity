import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface ConnectivityContextType {
  isOnline: boolean;
  isConnected: boolean;
  connectionType: string | null;
  lastSyncTime: Date | null;
}

const ConnectivityContext = createContext<ConnectivityContextType | undefined>(undefined);

export function ConnectivityProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    // Subscribe to connectivity updates
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const online = (state.isConnected ?? false) && state.isInternetReachable !== false;
      setIsOnline(online);
      setIsConnected(state.isConnected ?? false);
      setConnectionType(state.type ?? null);
      
      console.log('ConnectivityContext: Network status -', {
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        isOnline: online,
      });

      // Update last sync time when going online
      if (online && !isOnline) {
        setLastSyncTime(new Date());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isOnline]);

  return (
    <ConnectivityContext.Provider
      value={{
        isOnline,
        isConnected,
        connectionType,
        lastSyncTime,
      }}
    >
      {children}
    </ConnectivityContext.Provider>
  );
}

export function useConnectivity() {
  const context = useContext(ConnectivityContext);
  if (!context) {
    throw new Error('useConnectivity must be used within ConnectivityProvider');
  }
  return context;
}
