import React, { useState, useEffect } from 'react';
import { Menu, X, User, BookOpen, Phone, Crown, ChevronDown, Trophy, Users, Brain, Target, GraduationCap } from 'lucide-react';
import Button from './Button';
import ProfileMenu from './ProfileMenu';
import { jwtDecode } from 'jwt-decode';
import CartIcon from './CartIcon';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('auth');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (e) {
                localStorage.removeItem('auth');
            }
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        {
            name: 'Notre École',
            icon: BookOpen,
            submenu: [
                { name: 'Notre équipe', href: '/ecole/equipe', icon: Users },
            ]
        },
        { name: 'Contact', icon: Phone, href: '/contact' }
    ];

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white shadow-sm'
                : 'bg-white'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <nav className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <a href="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                            <Crown className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="text-xl font-semibold text-gray-800">
                            Chess<span className="text-blue-500">Lab</span>
                        </span>
                    </a>

                    {/* Menu Desktop */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {menuItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative group"
                            >
                                <a
                                    href={item.href}
                                    className="flex items-center px-1 py-2 space-x-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                    {item.submenu && (
                                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                                    )}
                                </a>
                                {item.submenu && (
                                    <div className="invisible group-hover:visible absolute top-full left-0 w-56 py-2 mt-1 bg-white border border-gray-100 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200">
                                        {item.submenu.map((subitem) => (
                                            <a
                                                key={subitem.name}
                                                href={subitem.href}
                                                className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-500"
                                            >
                                                <subitem.icon className="w-4 h-4" />
                                                <span>{subitem.name}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        <CartIcon /> {/* Ajoutez l'icône du panier ici */}

                        {user ? (
                            <ProfileMenu email={user.email} />
                        ) : (
                            <div className="hidden sm:block">
                                <a href="/login">
                                    <Button variant="secondary" className="shadow-sm">
                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4" />
                                            <span>Se connecter</span>
                                        </div>
                                    </Button>
                                </a>
                            </div>
                        )}

                        {/* Menu Mobile Button */}
                        <button
                            className="lg:hidden p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-blue-50"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </nav>

                {/* Menu Mobile */}
                <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="py-4 space-y-2 border-t border-gray-100">
                        {menuItems.map((item) => (
                            <div key={item.name}>
                                <button
                                    onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                                    className="w-full flex items-center justify-between px-4 py-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-500 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                    {item.submenu && (
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''
                                            }`} />
                                    )}
                                </button>
                                {item.submenu && activeDropdown === item.name && (
                                    <div className="mt-1 ml-4 space-y-1">
                                        {item.submenu.map((subitem) => (
                                            <a
                                                key={subitem.name}
                                                href={subitem.href}
                                                className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-500 rounded-lg"
                                            >
                                                <subitem.icon className="w-4 h-4" />
                                                <span>{subitem.name}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {!user && (
                            <div className="px-4 pt-2">
                                <a href="/login" className="block sm:hidden">
                                    <Button variant="secondary" className="w-full shadow-sm">
                                        <div className="flex items-center justify-center space-x-2">
                                            <User className="w-4 h-4" />
                                            <span>Se connecter</span>
                                        </div>
                                    </Button>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;