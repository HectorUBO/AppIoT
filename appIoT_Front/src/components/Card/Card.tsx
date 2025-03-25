import { Icon } from "@mui/material";
import "./Card.css";

interface CardProps {
  title: string;
  value: string;
  icon?: string;
  className?: string;
}

export const Card = ({ title, value, icon, className }: CardProps) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        {icon && (
          <div className="card-icon">
            <Icon>{icon}</Icon>
          </div>
        )}
        <span className="card-title">{title}</span>
      </div>
      <div className="card-value">{value}</div>
    </div>
  );
};