import { connect } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { Button, Form, InputGroup, Modal, Tab, Tabs, } from 'react-bootstrap'
import { withRouter } from 'react-router'
import { toast } from 'react-toastify';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createLofoItem } from '../apis'
import LoFoCard from '../components/LoFoCard'

function LostFound(props) {

    const { lofoItems } = props;
    const [posting, setPosting] = useState(false)
    const [open, setOpen] = useState(false)
    // const [data, setData] = useState([]);
    const [lost, setLost] = useState([]);
    const [found, setFound] = useState([]);
    const [search, setSearch] = useState('');
    const [file, setFile] = useState('');

    useEffect(() => {
        setLost(
            lofoItems.filter(item => item.status === 'lost' && item.title.toLowerCase().includes(search.toLowerCase()))
        );

        setFound(
            lofoItems.filter(item => item.status === 'found' && item.title.toLowerCase().includes(search.toLowerCase()))
        );

    }, [search, lofoItems])

    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = e.target
        const newItem = new FormData(formData)

        if (file !== '') {
            if (!file.type.includes('image')) {
                toast.warning('Please select image files only, e.g: png, jpg, jpeg etc')
                setPosting(false)
                return
            }
        }
        setPosting(true)
        createLofoItem(newItem)
            .then(res => {
                console.log(res)
                toast.success(`Posted: ${res.data.title}`);
                const { status } = res.data
                if (status === 'lost') {
                    setLost(prev => [res.data, ...prev])
                } else {
                    setFound(prev => [res.data, ...prev])
                }
                setPosting(false);
                setOpen(false)
            })
            .catch(err => {
                setPosting(false)
                toast.error("Failed to post");
                console.log(err)
            })
    };

    function Data(props) {
        return (
            <>
                <div className="container-fluid" style={{ bgColor: "#555" }}>
                    <div className="row mt-3">
                        {
                            props.items.length === 0 ? <h6 className='text-center text-secondary mt-5'>No items!</h6> :
                                props.items.map((item, i) =>
                                    <div key={i} className="col-12 col-md-6 p-0 py-2 p-md-2">
                                        <LoFoCard
                                            setFound={setFound}
                                            setLost={setLost}
                                            item={item} />
                                    </div>
                                )
                        }
                    </div>
                </div>

            </>
        )
    }
    return (
        <>
            <div className="my-3 container-lg px-3 px-md-4">
                <div className="d-flex flex-column flex-md-row mx-md-2 justify-content-between" >
                    <h3 className='text-center mb-3' >Lost/Found Portal - IIT Indore</h3>
                    <div className='d-flex mb-3 p-0 justify-content-between'>
                        <Form onSubmit={(e) => {
                            e.preventDefault()
                        }} >
                            <InputGroup
                                style={{
                                    width: "90%",
                                }}
                            >
                                <Form.Control
                                    placeholder='Search...'
                                    className='non-outlined-btn'
                                    onChange={(e) => setSearch(e.target.value)} value={search}
                                    style={{
                                        borderRight: 'none'
                                    }} />
                                <Button size='sm' onClick={() => setSearch('')}
                                    variant='transparent' className='text-secondary'
                                    style={{
                                        border: '1px solid #ced4da',
                                        borderLeft: 'none'
                                    }}
                                ><FontAwesomeIcon icon={faTimes}
                                    style={{
                                        opacity: search === '' ? '0' : '1'
                                    }}
                                    /></Button>

                            </InputGroup>
                        </Form>
                        <span className='bg-light p-2 py-auto rounded ' role={'button'} onClick={() => setOpen(true)}
                            style={{
                                fontSize: 13
                            }}
                        >
                            Add <FontAwesomeIcon icon={faPlus} />
                        </span>
                    </div>
                </div>

                <Tabs
                    className='d-flex mx-md-2'
                    defaultActiveKey="lost"
                    transition={false}
                    id="noanim-tab-example"

                >
                    <Tab eventKey="lost" title="Lost">
                        <Data items={lost} />
                    </Tab>
                    <Tab eventKey="found" title="Found">
                        <Data items={found} />
                    </Tab>
                </Tabs>

                <Modal className='p-0' onHide={() => setOpen(false)} show={open}>
                    <Modal.Header className='fw-bold d-flex justify-content-between'>
                        <span>LOST / FOUND</span>
                        <span><FontAwesomeIcon size='lg' icon={faTimes} onClick={() => setOpen(false)} role='button' /></span>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex flex-wrap justify-content-center">
                            <form className="needs-validation" id="itemForm" noValidate="" onSubmit={handleSubmit} >
                                <div className="row g-4">
                                    <div className="col-12">
                                        <label htmlFor="productTitle" className="form-label">Title<span className='text-danger fw-bold'>*</span></label>
                                        <input autoCapitalize="sentences" required type="text" className="form-control custom-form" id="productTitle" placeholder="Enter Title" name="title" />
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="description" className="form-label">Description<span className='text-danger fw-bold'>*</span> </label>
                                        <div className="input-group has-validation">
                                            <textarea autoCapitalize="sentences" required className="form-control custom-form" id="description" placeholder="Enter Description" name="description" />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-center flex-column bd-highlight mb-3">

                                        <div className="col-12  d-flex justify-content-center flex-column bd-highlight mb-4">

                                            <label htmlFor='status' className="form-label">Status<span className='text-danger fw-bold'>*</span></label>

                                            <div className="row ms-2">
                                                <div className="me-3 d-flex col-auto">
                                                    <input type="radio" id="lost" name="status" value={'lost'} />
                                                    <label className='ms-2' htmlFor="lost">Lost</label>
                                                </div>
                                                <div className="me-3 d-flex  col">
                                                    <input type="radio" id="found" name="status" value={'found'} />
                                                    <label className='ms-2' htmlFor="found">Found</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-6 d-flex justify-content-center flex-column bd-highlight mb-4">
                                            <label htmlFor="date" className="form-label" required>Date of Lost/Found<span className='text-danger fw-bold'>*</span></label>
                                            <input required min="0" type="date" className="form-control" id="date" placeholder="Choose Date" name="date" />
                                        </div>

                                        <div className="col-12 d-flex justify-content-center flex-column bd-highlight mb-3">
                                            <label htmlFor="image1" className="form-label">Upload Image e.g:  png, jpg, jpeg</label>
                                            <input onChange={(e) => setFile(e.target.files[0])} type="file" accept="image/*" className="form-control" id="image1" placeholder="Required" name="file1" />
                                        </div>
                                    </div>
                                </div>

                                <hr className="mb-3" />
                                <div className="d-flex gap-3 w-50 m-auto bd-highlight mb-3 justify-content-center ">
                                    <button className="w-100 btn btn-danger btn-sm" type="reset">
                                        Reset
                                    </button>
                                    <button className="w-100 btn btn-success btn-sm" type="submit">
                                        {posting ? "Posting..." : "Post"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                </Modal>

                <br />
            </div>

        </>
    )
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
        auth: state.authorised,
        lofoItems: state.lofoItems,
        authLoading: state.authLoading
    }
};

export default withRouter(connect(mapStateToProps)(LostFound));
