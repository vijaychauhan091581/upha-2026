"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Check } from "lucide-react";
import { OfficeBearerData, getOfficeBearers, createOfficeBearer, updateOfficeBearer, deleteOfficeBearer } from "@/lib/api";


export default function CouncilMembersTable() {
  const [members, setMembers] = useState<OfficeBearerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<OfficeBearerData | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [order, setOrder] = useState("0");
  const [term, setTerm] = useState("2023 - 2027");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await getOfficeBearers();
      if (res.success) {
        setMembers(res.office_bearers);
      } else {
        showToast("Failed to load council members", "error");
      }
    } catch (err) {
      showToast("An error occurred while loading", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member?: OfficeBearerData) => {
    if (member) {
      setEditingMember(member);
      setName(member.name);
      setRole(member.role);
      setOrder(member.order.toString());
      setTerm(member.term || "2023 - 2027");
      setImagePreview(member.image);
      setImageFile(null);
    } else {
      setEditingMember(null);
      setName("");
      setRole("");
      setOrder("0");
      setTerm("2023 - 2027");
      setImagePreview(null);
      setImageFile(null);
    }
    setModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) {
      showToast("Name and Role are required", "error");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role);
      formData.append("order", order);
      formData.append("term", term);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (editingMember) {
        formData.append("id", editingMember.id.toString());
      }

      const res = editingMember 
        ? await updateOfficeBearer(formData)
        : await createOfficeBearer(formData);

      if (res.success) {
        showToast(editingMember ? "Member updated successfully" : "Member added successfully", "success");
        setModalOpen(false);
        fetchMembers();
      } else {
        showToast(res.message || "Operation failed", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this council member?")) return;
    try {
      const res = await deleteOfficeBearer(id);
      if (res.success) {
        showToast("Member deleted successfully", "success");
        fetchMembers();
      } else {
        showToast(res.message || "Delete failed", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-24 right-6 z-[200] px-6 py-3 rounded text-xs font-bold tracking-widest shadow-xl text-white ${toastMessage.type === 'success' ? 'bg-[#3c8c7c]' : 'bg-red-600'}`}>
          {toastMessage.message}
        </div>
      )}

      {!modalOpen ? (
        <>
          <div className="flex justify-between items-center bg-white p-6 rounded-sm border border-gray-200">
        <div>
          <h2 className="font-heading text-xl font-bold text-gray-800 uppercase tracking-wide">Council Members</h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">Manage office bearers shown on the council and home pages</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-sm text-[10px] font-bold tracking-widest uppercase shadow-sm transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> ADD MEMBER
        </button>
      </div>

      <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 font-mono text-sm">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-mono text-sm">No council members added yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                  <th className="p-4 pl-6 w-20">Photo</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 w-24">Order</th>
                  <th className="p-4">Term</th>
                  <th className="p-4 pr-6 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      {member.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={member.image} alt={member.name} className="w-12 h-12 object-cover rounded-sm border border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-sm border border-gray-200 flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-gray-800">{member.name}</td>
                    <td className="p-4 text-gray-600">{member.role}</td>
                    <td className="p-4 text-gray-500 font-mono">{member.order}</td>
                    <td className="p-4 text-gray-500 font-mono text-xs">{member.term || '2023 - 2027'}</td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(member)}
                          className="w-8 h-8 flex items-center justify-center rounded-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-sm bg-red-50 text-red-600 hover:bg-red-100 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      ) : (
        <div className="bg-white rounded-sm border border-gray-200 overflow-hidden animate-in fade-in duration-200">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h3 className="font-heading text-lg font-bold text-gray-800 uppercase tracking-wide">
                  {editingMember ? "EDIT MEMBER" : "ADD MEMBER"}
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-1">
                  {editingMember ? "Update council member details" : "Add a new office bearer to the council"}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-sm text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-sm p-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                    placeholder="e.g. Anandeshwar Pandey"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">ROLE / DESIGNATION *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-gray-200 rounded-sm p-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                    placeholder="e.g. General Secretary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">DISPLAY ORDER</label>
                  <input
                    type="number"
                    required
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full border border-gray-200 rounded-sm p-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition font-mono"
                    placeholder="0"
                  />
                  <p className="text-[9px] text-gray-400 mt-1">Lower numbers appear first</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">TERM *</label>
                  <input
                    type="text"
                    required
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full border border-gray-200 rounded-sm p-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                    placeholder="e.g. 2023 - 2027"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">PHOTO</label>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center shrink-0 overflow-hidden">
                      {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-[10px] file:font-bold file:tracking-widest file:uppercase file:bg-accent/10 file:text-accent hover:file:bg-accent/20 transition cursor-pointer"
                      />
                      <p className="text-[9px] text-gray-400 mt-2">Square aspect ratio recommended (e.g. 400x400px)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 rounded-sm text-[10px] font-bold tracking-widest text-gray-500 hover:bg-gray-100 uppercase transition"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-accent hover:bg-accent/90 disabled:opacity-50 text-white px-6 py-3 rounded-sm text-[10px] font-bold tracking-widest uppercase shadow-sm transition flex items-center gap-2"
                >
                  {submitting ? "SAVING..." : <><Check className="w-4 h-4" /> SAVE MEMBER</>}
                </button>
              </div>
            </form>
        </div>
      )}
    </div>
  );
}
