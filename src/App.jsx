import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import Axios from "axios";
import { Accordion, Card, Modal, Button } from "react-bootstrap";

export const API_URL = "http://localhost:8080";

class App extends React.Component {
  state = {
    productList: [],
    createForm: {
      name: "",
      description: "",
      price: "",
    },
    editForm: {
      name: "",
      description: "",
      price: "",
    },
    modalOpen: false,
  };

  componentDidMount() {
    this.getProductList();
  }

  inputHandler = (e, field, form) => {
    let { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
  };

  getProductList = () => {
    Axios.get(`${API_URL}/products`)
      .then((res) => {
        this.setState({ productList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderProductList = () => {
    return this.state.productList.map((val, idx) => {
      const { id, name, description, price } = val;
      return (
        <>
          <tr>
            <td>{idx + 1}</td>
            <td>{name}</td>
            <td>{description}</td>
            <td>{price}</td>
            <td>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => this.editBtnHandler(idx)}
              >
                Edit
              </button>{" "}
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => this.deleteBtnHandler(id)}
              >
                Delete
              </button>
            </td>
          </tr>
        </>
      );
    });
  };

  createProductHandler = () => {
    Axios.post(`${API_URL}/products`, this.state.createForm)
      .then((res) => {
        alert("Your item has been added to the list!");
        this.setState({
          createForm: {
            name: "",
            description: "",
            price: "",
          },
        });
        this.getProductList();
      })
      .catch((err) => {
        alert("Your item could not be added to the list!");
      });
  };

  editBtnHandler = (idx) => {
    this.setState({
      editForm: {
        ...this.state.productList[idx],
      },
      modalOpen: true,
    });
  };

  editProductHandler = () => {
    Axios.put(`${API_URL}/products`, this.state.editForm)
      .then((res) => {
        alert("Your item has been edited!");
        this.setState({ modalOpen: false });
        this.getProductList();
      })
      .catch((err) => {
        alert("Your item could not be edited!");
        console.log(err);
      });
  };

  deleteBtnHandler = (id) => {
    Axios.delete(`${API_URL}/products/${id}`)
      .then((res) => {
        alert("Your item has been deleted!");
        this.getProductList();
        console.log(res);
      })
      .catch((err) => {
        alert("Your item could not be deleted!");
        console.log(err);
      });
  };

  modalClose = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    return (
      <>
        <div className="container-fluid">
          <div className="row pt-3">
            <div className="col-lg-12">
              <h1>
                Simple CRUD
                <small className="text-muted">
                  {" "}
                  with ReactJS & Spring Boot
                </small>
              </h1>
              <hr />
              <Accordion>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    <strong>Add Product</strong>
                    <div className="float-right">▼</div>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <form>
                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">
                            Name
                          </label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.createForm.name}
                              onChange={(e) =>
                                this.inputHandler(e, "name", "createForm")
                              }
                            />
                          </div>
                        </div>

                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">
                            Description
                          </label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.createForm.description}
                              onChange={(e) =>
                                this.inputHandler(
                                  e,
                                  "description",
                                  "createForm"
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="form-group row">
                          <label className="col-sm-2 col-form-label">
                            Price
                          </label>
                          <div className="col-sm-10">
                            <input
                              type="number"
                              className="form-control"
                              value={this.state.createForm.price}
                              onChange={(e) =>
                                this.inputHandler(e, "price", "createForm")
                              }
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-primary btn-lg btn-block"
                          onClick={this.createProductHandler}
                        >
                          Submit
                        </button>
                      </form>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              <br />

              <div className="card">
                <div className="card-header">
                  <strong>Product List</strong>
                </div>
                <div className="card-body">
                  <table className="table">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Price</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>{this.renderProductList()}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal show={this.state.modalOpen} onHide={this.modalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.editForm.name}
                  onChange={(e) => this.inputHandler(e, "name", "editForm")}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.editForm.description}
                  onChange={(e) =>
                    this.inputHandler(e, "description", "editForm")
                  }
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={this.state.editForm.price}
                  onChange={(e) => this.inputHandler(e, "price", "editForm")}
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.modalClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.editProductHandler}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default App;
