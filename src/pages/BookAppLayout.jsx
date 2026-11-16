import { Outlet } from 'react-router-dom';

function BookAppLayout() {
    return (
        <div className="book-app min-h-screen bg-slate-50">
            <Outlet />
        </div>
    );
}

export default BookAppLayout;