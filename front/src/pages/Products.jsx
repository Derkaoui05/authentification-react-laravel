import React, { useState, useEffect } from 'react';
import { axiosClient } from '../API/axios';
import { useNavigate } from 'react-router-dom';

function Products() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [productId, setProductId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axiosClient.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const handleAddOrUpdateProduct = async () => {
        try {
            if (productId) {
                await axiosClient.put(`/product/${productId}`, { productName: name, price, description });
            } else {
                await axiosClient.post('/product', { productName: name, price, description });
            }
            setName('');
            setPrice('');
            setDescription('');
            setProductId(null);
            fetchProducts();
        } catch (error) {
            console.error('Failed to save product', error);
        }
    };

    const handleEditProduct = (product) => {
        setName(product.productName);
        setPrice(product.price);
        setDescription(product.description);
        setProductId(product.id);
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axiosClient.delete(`/product/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    const handleLogout = async () => {
        try {
            await axiosClient.post('/logout');
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Products</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdateProduct(); }} className="mb-4">
                <div className="flex space-x-2">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="border p-2 flex-1"
                    />
                    <input 
                        type="number" 
                        placeholder="Price" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        required 
                        className="border p-2 flex-1"
                    />
                    <input 
                        type="text" 
                        placeholder="Description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        className="border p-2 flex-1"
                    />
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {productId ? 'Update' : 'Add'} Product
                    </button>
                </div>
            </form>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Name</th>
                        <th className="py-2 px-4 border">Description</th>
                        <th className="py-2 px-4 border">Price</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td className="py-2 px-4 border">{product.productName}</td>
                            <td className="py-2 px-4 border">{product.description}</td>
                            <td className="py-2 px-4 border">{product.price}</td>
                            <td className="py-2 px-4 border">
                                <button 
                                    onClick={() => handleEditProduct(product)} 
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDeleteProduct(product.id)} 
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Products;
