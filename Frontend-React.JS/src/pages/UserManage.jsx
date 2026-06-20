import React, { useState } from 'react';
import { Table, Button, Spinner, Modal, Form, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, UserPlus, Eye, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api.js';

const UserManage = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // null means CREATE, object means EDIT

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('M');
  const [roleId, setRoleId] = useState('R3');
  const [positionId, setPositionId] = useState('P0');

  // Fetch Users
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/api/get-all-users?id=All');
      return res.data.users || [];
    },
  });

  // Mutators
  const createMutation = useMutation({
    mutationFn: async (payload) => await api.post('/api/create-new-user', payload),
    onSuccess: (res) => {
      if (res.data.errCode === 0) {
        toast.success('Thêm người dùng mới thành công!');
        queryClient.invalidateQueries(['users']);
        handleCloseModal();
      } else {
        toast.error(res.data.errMessage || 'Lỗi thêm người dùng!');
      }
    },
  });

  const editMutation = useMutation({
    mutationFn: async (payload) => await api.put('/api/edit-user', payload),
    onSuccess: (res) => {
      if (res.data.errCode === 0) {
        toast.success('Cập nhật người dùng thành công!');
        queryClient.invalidateQueries(['users']);
        handleCloseModal();
      } else {
        toast.error(res.data.errMessage || 'Lỗi cập nhật người dùng!');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId) => await api.delete('/api/delete-user', { data: { id: userId } }),
    onSuccess: (res) => {
      if (res.data.errCode === 0) {
        toast.success('Xóa người dùng thành công!');
        queryClient.invalidateQueries(['users']);
      } else {
        toast.error(res.data.errMessage || 'Lỗi xóa người dùng!');
      }
    },
  });

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    if (user) {
      setEmail(user.email);
      setPassword('');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setAddress(user.address || '');
      setPhoneNumber(user.phoneNumber || '');
      setGender(user.gender || 'M');
      setRoleId(user.roleId || 'R3');
      setPositionId(user.positionId || 'P0');
    } else {
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setAddress('');
      setPhoneNumber('');
      setGender('M');
      setRoleId('R3');
      setPositionId('P0');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      deleteMutation.mutate(userId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      email,
      firstName,
      lastName,
      address,
      phoneNumber,
      gender,
      roleId,
      positionId,
    };

    if (selectedUser) {
      payload.id = selectedUser.id;
      editMutation.mutate(payload);
    } else {
      payload.password = password;
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="bg-white rounded border shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-dark m-0">Quản lý người dùng</h4>
        <Button variant="primary" onClick={() => handleOpenModal()} className="btn-premium-main d-flex align-items-center gap-2">
          <UserPlus size={16} />
          <span>Thêm người dùng</span>
        </Button>
      </div>

      {loadingUsers ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table responsive striped bordered hover className="align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Họ tên</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Vai trò</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {usersData?.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.lastName} {user.firstName}</td>
                <td>{user.phoneNumber || 'N/A'}</td>
                <td className="text-truncate" style={{ maxWidth: '200px' }}>{user.address || 'N/A'}</td>
                <td>
                  <span className={`badge ${
                    user.roleId === 'R1' ? 'bg-danger' : user.roleId === 'R2' ? 'bg-success' : 'bg-secondary'
                  }`}>
                    {user.roleId === 'R1' ? 'Admin' : user.roleId === 'R2' ? 'Bác sĩ' : 'Bệnh nhân'}
                  </span>
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Button variant="outline-primary" size="sm" onClick={() => handleOpenModal(user)}>
                      <Edit size={14} />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {usersData?.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">Chưa có người dùng nào được tạo.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* User Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-main-color">
            {selectedUser ? 'Cập nhật thông tin người dùng' : 'Thêm người dùng mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label className="fw-semibold small">Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    disabled={!!selectedUser}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              {!selectedUser && (
                <Col md={6}>
                  <Form.Group controlId="password">
                    <Form.Label className="fw-semibold small">Mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              )}

              <Col md={6}>
                <Form.Group controlId="lastName">
                  <Form.Label className="fw-semibold small">Họ</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="firstName">
                  <Form.Label className="fw-semibold small">Tên</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="phoneNumber">
                  <Form.Label className="fw-semibold small">Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="address">
                  <Form.Label className="fw-semibold small">Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="gender">
                  <Form.Label className="fw-semibold small">Giới tính</Form.Label>
                  <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="M">Nam</option>
                    <option value="F">Nữ</option>
                    <option value="O">Khác</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="roleId">
                  <Form.Label className="fw-semibold small">Vai trò</Form.Label>
                  <Form.Select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                    <option value="R1">Admin</option>
                    <option value="R2">Bác sĩ</option>
                    <option value="R3">Bệnh nhân</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="positionId">
                  <Form.Label className="fw-semibold small">Học hàm học vị</Form.Label>
                  <Form.Select value={positionId} onChange={(e) => setPositionId(e.target.value)}>
                    <option value="P0">Bác sĩ</option>
                    <option value="P1">Thạc sĩ</option>
                    <option value="P2">Tiến sĩ</option>
                    <option value="P3">Phó giáo sư</option>
                    <option value="P4">Giáo sư</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="px-4">
            <Button variant="outline-secondary" onClick={handleCloseModal}>Huỷ</Button>
            <Button variant="primary" type="submit" className="btn-premium-main">Lưu lại</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManage;
