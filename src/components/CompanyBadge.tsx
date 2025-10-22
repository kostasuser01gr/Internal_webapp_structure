import { Badge } from './ui/badge';
import { getCompanyById } from '../lib/utils';

interface CompanyBadgeProps {
  companyId: string;
  showDot?: boolean;
  variant?: 'default' | 'outline';
  className?: string;
}

export function CompanyBadge({ 
  companyId, 
  showDot = true, 
  variant = 'outline',
  className = '' 
}: CompanyBadgeProps) {
  const company = getCompanyById(companyId);
  
  if (!company) {
    return <Badge variant={variant}>N/A</Badge>;
  }

  return (
    <Badge 
      variant={variant}
      className={`inline-flex items-center gap-2 ${className}`}
      style={
        variant === 'default' 
          ? {
              backgroundColor: `${company.color}20`,
              color: company.color,
              borderColor: company.color,
            }
          : {}
      }
    >
      {showDot && (
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: company.color }}
        />
      )}
      <span>{company.name}</span>
    </Badge>
  );
}
