import React, { useState } from 'react';
import { Lock, ShieldAlert, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/supabase/auth-context';
import type { UserRole } from '@/types/database.types';
import { AuthModal } from './AuthModal';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  title?: string;
  description?: string;
  onNavigateHome?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  title = 'Khu Vực Yêu Cầu Xác Thực',
  description = 'Vui lòng đăng nhập để truy cập hồ sơ học viên, lưu tiến độ đa thiết bị và nộp bài đánh giá năng lực.',
  onNavigateHome,
}) => {
  const { user, profile, role, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[360px] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Đang kiểm tra phiên làm việc...</p>
      </div>
    );
  }

  // Not logged in (neither Supabase user nor local profile)
  const isAuthenticated = Boolean(user || profile);
  if (!isAuthenticated) {
    return (
      <div className="min-h-[420px] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-8 text-center space-y-5 shadow-2xl backdrop-blur-sm">
          <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium text-xs transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Đăng Nhập / Tạo Tài Khoản Học Viên</span>
            </button>

            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="w-full py-2 px-4 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Về Trang Chủ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  // Role check if requiredRole is specified
  if (requiredRole && role !== requiredRole && role !== 'admin') {
    return (
      <div className="min-h-[420px] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900/60 border border-red-500/30 rounded-xl p-8 text-center space-y-5 shadow-2xl backdrop-blur-sm">
          <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-100">Không Đủ Quyền Hạn Truy Cập</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Khu vực này yêu cầu vai trò <span className="font-mono text-amber-400 font-semibold">{requiredRole.toUpperCase()}</span>.
              Vai trò hiện tại của bạn là <span className="font-mono text-zinc-300 font-semibold">{role.toUpperCase()}</span>.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
            >
              Chuyển Đổi Tài Khoản / Vai Trò
            </button>

            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="w-full py-2 px-4 rounded-lg bg-zinc-800/40 hover:bg-zinc-800 text-zinc-400 text-xs transition-colors"
              >
                Về Trang Chủ
              </button>
            )}
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  return <>{children}</>;
};
