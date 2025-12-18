import { Outlet, Link } from "react-router-dom";

const USAppLayout = () => {
    return (
        <div className="min-h-screen flex flex-col -mb-10">
            {/* floating button to navigate to main page, to be implemented, using react router dom Link */}
            <div className="fixed bottom-4 right-4 z-50">
                <Link to="/usapp#demo" className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors">
                    Back to Main Page
                </Link>
            </div>
            <div className=""></div>
             <Outlet />
        </div>
    );
};
export default USAppLayout;