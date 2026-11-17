import { Outlet } from 'react-router-dom';

function BookAppLayout() {
    return (
        <div className="book-app paper-grain min-h-screen bg-background text-foreground antialiased selection:bg-primary/15 selection:text-primary">
            <Outlet />
        </div>
    );
}

export default BookAppLayout;