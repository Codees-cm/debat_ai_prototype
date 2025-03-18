import { useSearchParams } from 'next/navigation';
import SignInForm from '@/components/SignInForm';

const SignInPage = () => {
    const searchParams = useSearchParams();
    const registrationSuccess = searchParams.get('registration') === 'success';

    return (
        <div className="min-h-screen bg-gray-50">
            {registrationSuccess && (
                <div className="max-w-md mx-auto pt-6">
                    <div className="bg-green-50 text-green-600 p-4 rounded-md text-sm text-center">
                        Account created successfully! Please sign in.
                    </div>
                </div>
            )}
            <SignInForm />
        </div>
    );
};

export default SignInPage;