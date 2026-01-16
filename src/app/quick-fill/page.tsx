import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import QuickFillClient from './quick-fill-client';

export interface AdhocElement {
    id: string;
    type: 'text' | 'signature' | 'checkmark';
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    value: string;
    color?: string;
    fontWeight?: 'normal' | 'bold';
}

export default async function QuickFillPage() {
    const session = await auth();

    if (!session) {
        redirect('/auth/signin?callbackUrl=/quick-fill');
    }

    return <QuickFillClient />;
}
