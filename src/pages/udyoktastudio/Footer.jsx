import { useApp } from "../UdyoktaStudio";

function Footer() {
    const { theme, t } = useApp();

    return (
        <footer className={`py-12 border-t ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white">
                                    US
                                </div>
                                <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    UdyoktaStudio
                                </span>
                            </div>
                            <p className={`text-sm italic ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                                {t.footer.tagline}
                            </p>
                        </div>

                        <div className={`text-sm text-center md:text-right max-w-md ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                            <p className="mb-2">{t.footer.about}</p>
                            <p className="text-xs">© 2024 UdyoktaStudio. {t.footer.rights}</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;