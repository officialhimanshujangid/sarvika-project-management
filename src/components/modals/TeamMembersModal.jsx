import React from 'react';
import { FiX, FiUsers } from 'react-icons/fi';

const TeamMembersModal = ({ 
  isOpen, 
  onClose, 
  team, 
  teamMembers = [] 
}) => {
  if (!isOpen || !team) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 !p-4">
      <div className="bg-[var(--bg-secondary)] !rounded-xl !p-6 w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between !mb-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              {team.name} Members
            </h2>
            <p className="text-[var(--text-secondary)] text-xs">
              {team.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {teamMembers.length > 0 ? (
            <div className="!space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center !gap-4 !p-4 bg-[var(--bg-tertiary)] !rounded-lg"
                >
                  <div className="w-10 h-10 bg-[var(--accent-primary)] rounded-full flex items-center justify-center text-white font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[var(--text-primary)]">
                      {member.name}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {member.email}
                    </p>
                    <span className="inline-block !px-2 !py-1 text-xs bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] !rounded-full !mt-1">
                      {member.userType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center !py-8">
              <FiUsers size={48} className="!mx-auto text-[var(--text-secondary)] !mb-4" />
              <p className="text-[var(--text-secondary)]">No members assigned to this team</p>
            </div>
          )}
        </div>

        <div className="!pt-4 border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="w-full !px-4 !py-3 bg-[var(--accent-primary)] text-white !rounded-lg hover:bg-[var(--accent-primary)]/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMembersModal;
