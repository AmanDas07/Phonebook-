import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Form, Button, Container, Row, Col, Pagination, Card } from 'react-bootstrap';
import { UserContext } from '../context/page';

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [query, setQuery] = useState('');
    const [totalContacts, setTotalContacts] = useState(0);
    const [newContact, setNewContact] = useState({ name: '', email: '', phoneNumber: '', postalAddress: '' });
    const [state, setState] = useContext(UserContext);

    useEffect(() => {
        fetchContacts();
    }, [page, rowsPerPage]);

    const fetchContacts = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:3001/contacts?page=${page}&limit=${rowsPerPage}`, {
                headers: { Authorization: `Bearer ${state.token}` },
            });
            setContacts(response.data.contacts);
            setTotalContacts(response.data.total);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:3001/contacts/search?query=${query}`, {
                headers: { Authorization: `Bearer ${state.token}` },
            });
            setContacts(response.data);
        } catch (error) {
            console.error('Error searching contacts:', error);
        }
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:3001/contacts', newContact, {
                headers: { Authorization: `Bearer ${state.token}` },
            });
            setContacts([...contacts, response.data]);
            setNewContact({ name: '', email: '', phoneNumber: '', postalAddress: '' });
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(1);
    };

    const totalPages = Math.ceil(totalContacts / rowsPerPage);

    return (
        <Container className="mt-5">
            <Card className="mb-4">
                <Card.Header>
                    <Form onSubmit={handleSearch}>
                        <Row>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button type="submit" variant="primary">Search</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Header>
            </Card>
            <Card className="mb-4">
                <Card.Header>Add New Contact</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleAddContact}>
                        <Row className="mb-3">
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Name"
                                    value={newContact.name}
                                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    value={newContact.email}
                                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Phone Number"
                                    value={newContact.phoneNumber}
                                    onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Postal Address"
                                    value={newContact.postalAddress}
                                    onChange={(e) => setNewContact({ ...newContact, postalAddress: e.target.value })}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button type="submit" variant="success">Add</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead className="thead-dark">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Postal Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map(contact => (
                                <tr key={contact.id}>
                                    <td>{contact.name}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.phoneNumber}</td>
                                    <td>{contact.postalAddress}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
                <Card.Footer>
                    <Row className="align-items-center">
                        <Col xs="auto">
                            <Form.Control
                                as="select"
                                value={rowsPerPage}
                                onChange={handleRowsPerPageChange}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </Form.Control>
                        </Col>
                        <Col>
                            <Pagination className="justify-content-end mb-0">
                                <Pagination.Prev
                                    disabled={page === 1}
                                    onClick={() => handlePageChange(page - 1)}
                                />
                                {[...Array(totalPages).keys()].map(num => (
                                    <Pagination.Item
                                        key={num + 1}
                                        active={num + 1 === page}
                                        onClick={() => handlePageChange(num + 1)}
                                    >
                                        {num + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    disabled={page === totalPages}
                                    onClick={() => handlePageChange(page + 1)}
                                />
                            </Pagination>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default Contacts;
