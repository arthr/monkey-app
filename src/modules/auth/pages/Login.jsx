import React from "react";
import useAuth from '../hooks/useAuth';

const Login = () => {
    const auth = useAuth();

    return (
        <div className="px-6 py-8 mx-auto lg:py-0">
            <a href="./" className="flex justify-center mb-2 text-2xl font-semibold text-gray-900">
                <img src="rpm.svg" width={260} height={160} className="mb-2" />
            </a>
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <form className="space-y-4 md:space-y-6">
                        <h3 className="text-2xl text-center">Acessar Plataforma</h3>
                        <button onClick={() => void auth.login()} type="button" className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Entrar</button>
                        <p className="text-sm text-center font-light text-gray-500">
                            Ainda não tem acesso?<br />
                            <a href="mailto:ti@diretacapital.com.br" className="font-medium text-xs text-primary-600 hover:underline">
                                Solicitar Acesso
                            </a>
                        </p>
                    </form>
                </div>
            </div>
            {/* Additional Information */}
            <div className="mt-4 text-sm text-gray-500">
                <p>Para mais informações, entre em contato com o suporte.</p>
            </div>
        </div>
    );
};

export default Login;