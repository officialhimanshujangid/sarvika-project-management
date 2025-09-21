import React from 'react';
import { FiX, FiUser, FiMail, FiUsers, FiCalendar, FiEdit } from 'react-icons/fi';

const EmployeeViewModal = ({ 
  isOpen, 
  onClose, 
  employee,
  team,
  onEdit
}) => {
  if (!isOpen || !employee) return null;

 

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 !p-4">
      <div className="bg-[var(--bg-secondary)] !rounded-xl !p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between !mb-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Employee Details
            </h2>
            <p className="text-[var(--text-secondary)] text-xs">
              View employee information and team assignment
            </p>
          </div>
          <div className="flex items-center !gap-2">
            <button
              onClick={() => onEdit(employee)}
              className="!p-2 text-blue-600 hover:bg-blue-50 !rounded-lg transition-colors"
              title="Edit Employee"
            >
              <FiEdit size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Employee Avatar and Basic Info */}
          <div className="flex items-start !gap-6 !p-6 bg-[var(--bg-tertiary)] !rounded-lg">
            <div className="w-20 h-20 bg-[var(--accent-primary)] !rounded-full flex items-center justify-center text-white font-bold text-lg">
              {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[var(--text-primary)] !mb-2">
                {employee.name}
              </h3>
              <div className="flex items-center !gap-2 !mb-2">
                <span className="inline-block !px-3 !py-1 text-xs bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-full">
                  {employee.userType === 'head' ? 'Team Head' : 'Employee'}
                </span>
                {team && (
                  <span className="inline-block !px-3 !py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                    {team.name}
                  </span>
                )}
              </div>
              <p className="text-[var(--text-secondary)]">
                Username: <span className="font-medium">{employee.username}</span>
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 !gap-6">
            <div className="!space-y-4">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] !pb-2">
                Contact Information
              </h4>
              
              <div className="flex items-center !gap-3">
                <FiMail className="text-[var(--text-secondary)]" size={20} />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Email</p>
                  <p className="font-medium text-[var(--text-primary)]">{employee.email}</p>
                </div>
              </div>

              <div className="flex items-center !gap-3">
                <FiUser className="text-[var(--text-secondary)]" size={20} />
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Username</p>
                  <p className="font-medium text-[var(--text-primary)]">{employee.username}</p>
                </div>
              </div>
            </div>

            <div className="!space-y-4">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] !pb-2">
                Team Information
              </h4>
              
              {team ? (
                <div className="flex items-center !gap-3">
                  <FiUsers className="text-[var(--text-secondary)]" size={20} />
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Assigned Team</p>
                    <p className="font-medium text-[var(--text-primary)]">{team.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{team.description}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center !gap-3">
                  <FiUsers className="text-[var(--text-secondary)]" size={20} />
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Team Assignment</p>
                    <p className="font-medium text-[var(--text-secondary)]">Not assigned to any team</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="!pt-6 border-t border-[var(--border-color)] !mt-6">
                <div className="flex items-center !gap-3">
            <button
              onClick={() => onEdit(employee)}
              className="flex-1 !px-4 !py-3 bg-[var(--accent-primary)] text-white !rounded-lg hover:bg-[var(--accent-primary)]/90 transition-colors flex items-center justify-center !gap-2"
            >
              <FiEdit size={16} />
              Edit Employee
            </button>
            <button
              onClick={onClose}
              className="flex-1 !px-4 !py-3 border border-[var(--border-color)] text-[var(--text-primary)] !rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeViewModal;
