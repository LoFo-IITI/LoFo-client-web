import React, { useState, useEffect } from 'react';
import ItemList from '../components/ItemList';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import NOT_FOUND from './Not_Found';
import "./BuyStyle.css"
import Spinner from '../components/Spinner';
import { Button, Form, InputGroup, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketballBall, faBook, faGamepad, faSearch, faShoppingCart, faSplotch, faStore, faTimes } from '@fortawesome/free-solid-svg-icons';
import ItemCard from '../components/ItemCard';
import EmptySvg from '../svgs/EmptySvg';

function Buy(props) {
    const [search, setSearch] = useState('')
    const { category } = useParams()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(false)

    useEffect(() => {
        setLoading(true)
        category === 'All' ? axios.get('/api/items')
            .then(res => {
                setItems(res.data)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                setErr(true)
            })
            :
            axios.get(`/api/items/filter?categories=${category}`)
                .then(res => {
                    setItems(res.data)
                    setLoading(false)
                })
                .catch(err => {
                    setLoading(false)
                    setErr(true)
                })
    }, [category])

    const handleSubmit = (e) => {
        e.preventDefault();

        props.history.push(`/search/${search}`);
    };

    const handleChange = (e) => {
        setSearch(e.target.value)
    };


    const update = (id) => {
        const newItems = items.filter(item => item._id !== id)
        setItems(newItems)
    };

    if (err === false) {
        return (
            <>
                <section>
                    <div className="container-fluid px-4">
                        <div className="row">
                            <div className="col-12 col-md-3">

                                <Form onSubmit={handleSubmit} className='my-3' >
                                    <InputGroup>
                                        <Form.Control placeholder="Search buying items..." className='non-outlined-btn' onChange={handleChange} />
                                        <Button type='submit' ><FontAwesomeIcon icon={faSearch} /></Button>
                                    </InputGroup>

                                </Form>
                                <div className="row px-2">

                                    <div style={{ borderBottom: '1px solid #cccccc' }} className="col-4 col-md-12 px-1">
                                        <Button as={Link} to='/buy/All' className='non-outlined-btn category-btn' variant='transparent'
                                            style={{
                                                color: category === "All" ? "#287a68" : "#212529"
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faStore} />
                                            <span className='ms-2'
                                            >All</span>
                                        </Button>
                                    </div>

                                    <div style={{ borderBottom: '1px solid #cccccc' }} className="col-4 col-md-12 px-1">
                                        <Button as={Link} to='/buy/Sports' className='non-outlined-btn category-btn' variant='transparent'
                                            style={{
                                                color: category === "Sports" ? "#287a68" : "#212529"
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faBasketballBall} />
                                            <span className='ms-2'
                                            >Sports</span>
                                        </Button>
                                    </div>

                                    <div style={{ borderBottom: '1px solid #cccccc' }} className="col-4 col-md-12 px-1">
                                        <Button as={Link} to='/buy/Books' className='non-outlined-btn category-btn' variant='transparent'
                                            style={{
                                                color: category === "Books" ? "#287a68" : "#212529"
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faBook} />
                                            <span className='ms-2'
                                            >Books</span>
                                        </Button>
                                    </div>

                                    <div style={{ borderBottom: '1px solid #cccccc' }} className="col-4 col-md-12 px-1">
                                        <Button as={Link} to='/buy/Games' className='non-outlined-btn category-btn' variant='transparent'
                                            style={{
                                                color: category === "Games" ? "#287a68" : "#212529"
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faGamepad} />
                                            <span className='ms-2'
                                            >Games</span>
                                        </Button>
                                    </div>

                                    <div style={{ borderBottom: '1px solid #cccccc' }} className="col-4 col-md-12 px-1">
                                        <Button as={Link} to='/buy/Utilities' className='non-outlined-btn category-btn' variant='transparent'
                                            style={{
                                                color: category === "Utilities" ? "#287a68" : "#212529"
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faSplotch} />
                                            <span className='ms-2'
                                            >Utilities</span>
                                        </Button>
                                    </div>

                                    <div style={{ borderBottom: '1px solid #cccccc' }} className="col-4 col-md-12 px-1">
                                        <Button as={Link} to='/buy/Other' className='non-outlined-btn category-btn' variant='transparent'
                                            style={{
                                                color: category === "Other" ? "#287a68" : "#212529"
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faShoppingCart} />
                                            <span className='ms-2'
                                            >Other</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-9" style={{ borderLeft: '1px solid #cccccc' }}>

                                <div className="row">

                                    <div className="col-12 py-3" style={{ height: '85vh', overflowY: 'scroll' }} >
                                        {
                                            loading ? <Spinner /> :
                                                <div className="row px-md-3">
                                                    {items.length === 0 ?
                                                        <> <div style={{ width: '10%', margin: '50px auto 20px auto' }} ><EmptySvg />
                                                        </div>  <h3 className='text-center' >No Items!</h3></> :
                                                        items.map(item => (
                                                            <div className='col-6 col-md-4 col-lg-3 p-2'>
                                                                <ItemCard item={item} />
                                                            </div>
                                                        ))}
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )
    } else {
        return (
            <NOT_FOUND />
        )
    }

}
export default Buy;

