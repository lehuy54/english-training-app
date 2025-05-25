// components/ui/ProgressBar.tsx
import type { ProgressStats } from "../../types";

interface ProgressBarProps {
  stats: ProgressStats | null;
  loading: boolean;
  className?: string;
}

const ProgressBar = ({ stats, loading, className = '' }: ProgressBarProps) => {
  if (loading) {
    return (
      <div className={`progress ${className}`} style={{ height: '20px' }}>
        <div 
          className="progress-bar progress-bar-striped progress-bar-animated" 
          role="progressbar"
          style={{ width: '100%' }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`progress ${className}`} style={{ height: '20px' }}>
        <div 
          className="progress-bar bg-secondary" 
          role="progressbar"
          style={{ width: '100%' }}
        >
          Login to see progress
        </div>
      </div>
    );
  }

  // Sử dụng giá trị percentage trực tiếp từ stats nếu có, hoặc tính toán từ completed/total
  // Kiểm tra stats.total để tránh lỗi NaN khi chia cho 0
  const percentage = stats 
    ? (stats.percentage || (stats.total > 0 
        ? Math.min(Math.round((stats.completed / stats.total) * 100), 100) 
        : 0))
    : 0;

  return (
    <div className="d-flex flex-column">
      <div className={`progress ${className}`} style={{ height: '20px' }}>
        <div 
          className={`progress-bar ${percentage >= 100 ? 'bg-success' : 'bg-primary'}`}
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span className="fw-bold">{percentage}%</span>
        </div>
      </div>
      {/* Đã bỏ hiển thị số câu đúng/tổng số câu theo yêu cầu */}
    </div>
  );
};

export default ProgressBar;
