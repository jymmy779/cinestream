import React, { Suspense } from 'react';
import ProfileContent from '@/app/(pages)/ca-nhan/ProfileContent';
import ProfileSkeleton from './components/ProfileSkeleton';

export const metadata = {
  title: 'Trang cá nhân | CineStream',
  description: 'Quản lý tài khoản, lịch sử xem phim và danh sách yêu thích của bạn tại CineStream.',
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
    </Suspense>
  );
}
