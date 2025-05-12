import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

interface ErrorMessageProps {
  title: string;
  message: string;
  showBackButton?: boolean;
  backUrl?: string;
  backText?: string;
}

const ErrorMessage = ({
  title,
  message,
  showBackButton = true,
  backUrl = '/dashboard',
  backText = 'Voltar'
}: ErrorMessageProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F0F0E5]">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          {showBackButton && (
            <Link
              to={backUrl}
              className="inline-flex items-center gap-2 bg-[#8BA989] text-white px-6 py-2 rounded-lg hover:bg-[#6E8F6E] transition"
            >
              <FaArrowLeft />
              {backText}
            </Link>
          )}
        </div>
      </main>
    </div>
  );
};

export default ErrorMessage; 