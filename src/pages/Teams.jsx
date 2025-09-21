import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  createTeam, 
  updateTeam, 
  deleteTeam, 
  clearError 
} from '../redux/redux_slices/teamsSlice';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiUsers
} from 'react-icons/fi';
import { TeamFormModal, TeamMembersModal } from '../components/modals';

const Teams = () => {
  const dispatch = useDispatch();
  const { teams, loading, error } = useSelector((state) => state.teams);
  const { users } = useSelector((state) => state.auth);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [viewingTeam, setViewingTeam] = useState(null);

  // Clear error when component mounts
  React.useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  const handleCreateTeam = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setIsEditModalOpen(true);
  };

  const handleViewTeam = (team) => {
    setViewingTeam(team);
    setIsViewModalOpen(true);
  };

  const handleDeleteTeam = (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      dispatch(deleteTeam(teamId));
    }
  };

  const handleFormSubmit = (values) => {
    if (isCreateModalOpen) {
      dispatch(createTeam(values));
      setIsCreateModalOpen(false);
    } else if (isEditModalOpen) {
      dispatch(updateTeam({ id: editingTeam.id, ...values }));
      setIsEditModalOpen(false);
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setEditingTeam(null);
    setViewingTeam(null);
  };

  // Get team members by filtering users with matching teamId
  const getTeamMembers = (teamId) => {
    return users.filter(user => {
      // Convert both to numbers for comparison to handle string/number mismatches
      const userTeamId = parseInt(user.teamId);
      const targetTeamId = parseInt(teamId);
      return userTeamId === targetTeamId && userTeamId !== 0; // Also check that teamId is not 0 (falsy)
    });
  };

  return (
    <div className=" bg-[var(--bg-primary)] !p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="!mb-8">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] !mb-3">Teams Management</h1>
          <p className="text-lg text-[var(--text-secondary)]">Manage your organization's teams and members</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="!mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}



        {/* Add Team Button */}
        <div className="!mb-6">
          <button
            onClick={handleCreateTeam}
            className="flex items-center gap-2 !px-6 !py-3 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary)]/90 transition-all duration-200 shadow-lg"
          >
            <FiPlus size={20} />
            Add New Team
          </button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 !gap-6">
          {teams.map((team) => {
            const teamMembers = getTeamMembers(team.id);
            return (
              <div
                key={team.id}
                className="bg-[var(--bg-secondary)] rounded-xl !p-6 shadow-lg border border-[var(--border-color)] hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between !mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] !mb-2">
                      {team.name}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm !mb-3">
                      {team.description}
                    </p>
                      <div className="flex items-center !gap-2 text-sm text-[var(--text-secondary)]">
                      <FiUsers size={16} />
                      <span>{teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center !gap-2">
                  <button
                    onClick={() => handleViewTeam(team)}
                    className="flex items-center !gap-1 !px-3 !py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="View Members"
                  >
                    <FiEye size={16} />
                    <span className="text-sm">View</span>
                  </button>
                  
                  <button
                    onClick={() => handleEditTeam(team)}
                    className="flex items-center !gap-1 !px-3 !py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                    title="Edit Team"
                  >
                    <FiEdit2 size={16} />
                    <span className="text-sm">Edit</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="flex items-center !gap-1 !px-3 !py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete Team"
                  >
                    <FiTrash2 size={16} />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {teams.length === 0 && (
          <div className="text-center !py-12">
            <FiUsers size={64} className="mx-auto text-[var(--text-secondary)] mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Teams Found</h3>
            <p className="text-[var(--text-secondary)] mb-6">Create your first team to get started</p>
            <button
              onClick={handleCreateTeam}
              className="flex items-center !gap-2 !px-6 !py-3 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary)]/90 transition-all duration-200 mx-auto"
            >
              <FiPlus size={20} />
              Add New Team
            </button>
          </div>
        )}

        {/* Team Form Modal */}
        <TeamFormModal
          isOpen={isCreateModalOpen || isEditModalOpen}
          onClose={closeModals}
          onSubmit={handleFormSubmit}
          initialValues={editingTeam}
          isEdit={isEditModalOpen}
          loading={loading}
        />

        {/* Team Members Modal */}
        <TeamMembersModal
          isOpen={isViewModalOpen}
          onClose={closeModals}
          team={viewingTeam}
          teamMembers={viewingTeam ? getTeamMembers(viewingTeam.id) : []}
        />
      </div>
    </div>
  );
};

export default Teams;