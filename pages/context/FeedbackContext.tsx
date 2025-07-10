import { createContext, useContext, useState, ReactNode } from 'react';

interface FeedbackContextProps {
  showMessage: (msg: string) => void;
}

const FeedbackContext = createContext<FeedbackContextProps | undefined>(undefined);

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string>('');

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <FeedbackContext.Provider value={{ showMessage }}>
      {message && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
          {message}
        </div>
      )}
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error('useFeedback must be used within FeedbackProvider');
  return context;
};
