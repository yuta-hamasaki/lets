'use client';
import React from 'react';
import { ProfilePage } from '@/pages/ProfilePage';
import { useRouter, useParams } from 'next/navigation';

export default function ExternalProfilePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    return (
        <ProfilePage 
            userId={id} 
            onBack={() => router.back()} 
        />
    );
}
