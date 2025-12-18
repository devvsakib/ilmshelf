import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Layout wrapper for the Book Management App
 * Manages shared state and provides it to all book-related routes
 */
function BookAppLayout() {
    // State management for books app
    const [books, setBooks] = useState([]);
    const [shelves, setShelves] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [isCoverHidden, setIsCoverHidden] = useState(false);
    const [isAddingBook, setIsAddingBook] = useState(false);
    const [editingBookId, setEditingBookId] = useState(null);

    // Load data from localStorage on mount
    useEffect(() => {
        const savedBooks = localStorage.getItem('books');
        const savedShelves = localStorage.getItem('shelves');

        if (savedBooks) {
            try {
                const parsedBooks = JSON.parse(savedBooks);
                setBooks(parsedBooks);
                setFilteredBooks(parsedBooks);
            } catch (error) {
                console.error('Error loading books:', error);
            }
        }

        if (savedShelves) {
            try {
                const parsedShelves = JSON.parse(savedShelves);
                setShelves(parsedShelves);
            } catch (error) {
                console.error('Error loading shelves:', error);
            }
        }
    }, []);

    // Save books to localStorage whenever they change
    useEffect(() => {
        if (books.length > 0) {
            localStorage.setItem('books', JSON.stringify(books));
        }
    }, [books]);

    // Save shelves to localStorage whenever they change
    useEffect(() => {
        if (shelves.length > 0) {
            localStorage.setItem('shelves', JSON.stringify(shelves));
        }
    }, [shelves]);

    // Delete book function
    const deleteBook = (bookId) => {
        setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
        setFilteredBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
    };

    // Context value to pass to child routes
    const contextValue = {
        books,
        setBooks,
        shelves,
        setShelves,
        filteredBooks,
        setFilteredBooks,
        isCoverHidden,
        setIsCoverHidden,
        isAddingBook,
        setIsAddingBook,
        editingBookId,
        setEditingBookId,
        deleteBook
    };

    return (
        <div className="book-app min-h-screen bg-slate-50">
            {/* Pass context to all child routes via Outlet */}
            <Outlet context={contextValue} />
        </div>
    );
}

export default BookAppLayout;