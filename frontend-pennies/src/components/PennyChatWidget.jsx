import React, { useState } from 'react'
import ChatInterface from './ChatInterface'

export default function PennyChatWidget({ isOpen, onClose }) {
    // No internal state needed, controlled by App.jsx

    return (
        <>
            {/* Modal / Bottom Sheet */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center lg:justify-end lg:p-8 pointer-events-none">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
                        onClick={onClose}
                    />

                    {/* Chat Container */}
                    <div className="bg-white w-full lg:w-[400px] h-[80vh] lg:h-[600px] rounded-t-3xl lg:rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col animate-slide-up lg:animate-bounce-in relative">
                        <ChatInterface isModal={true} onClose={onClose} />
                    </div>
                </div>
            )}
        </>
    )
}
