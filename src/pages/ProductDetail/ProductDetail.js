import "./ProductDetail.scss";
import {useContext, useState} from "react";
import {CartContext, UserContext} from "../../App";
import AmountButton from "../../components/AmountButton/AmountButton";
import {useParams} from "react-router-dom";
import {getProductDetailById} from "./getProductDetailService";
import {checkObjectIsEmpty} from "../../utils/checkObjectIsEmpty";

export default function ProduceDetail() {

    const {id} = useParams();

    const {user} = useContext(UserContext);
    const {cart, setCart} = useContext(CartContext);

    const [amount, setAmount] = useState(1);
    const [gym, setGym] = useState(false);

    const product = getProductDetailById(id);

    const getProductIndexInCart = () => {
        for (let i = 0; i < cart.length; i++) {
            if (product.id === cart[i].product.id) {
                return i;
            }
        }
        return -1;
    }

    const putProductToCart = () => {
        let updatedCart = [...cart];
        let productIndex = getProductIndexInCart();
        if (productIndex === -1) {
            updatedCart.push({
                product: product,
                amount: amount,
            });
        } else {
            cart[productIndex].amount += amount;
        }

        setCart([...updatedCart]);
    };

    return (
        <section>
            <div className="Detail_page">
                <div className="product_detail_image">
                    <img src={product.productImage} className="product_image" alt="product"/>
                </div>
                <div className="product_information">
                    <div className="detail_title">
                        <span className="share_button">
                            <button type="button" className="share">
                                <img src="https://res.kurly.com/mobile/service/goodsview/1910/ico_view_sns.png"
                                     alt="share"/>
                            </button>
                        </span>
                        <div className="name_pro"><span className="product_name">{product.productName}</span></div>
                        <div className="explain">
                            <span className="product_explain">{product.productMessage}</span>
                        </div>
                    </div>
                    <div className="product_price">
                        <span className="price_tit">
                            <div className="price">
                                {(product.price).toLocaleString()}
                                <span className="won">???</span>
                            </div>

                        </span>
                        <span className="benefit">

                           {
                               checkObjectIsEmpty(user) ?
                                   // user X
                                   <div className="nlog_message">
                                <span className="nlog_ment">
                                    ????????? ???, ??????????????? ???????????????.
                                </span>
                                   </div>
                                   : <div className="ylog_message">
                                <span className="Rating">
                                    {user.grade.grade}&nbsp;
                                    {user.grade.accumulationPercent * 100}
                                    <span>%</span>
                                </span>
                                       <span className="nlog_bar">
                                    |
                                </span>
                                       <span className="Accumulate">
                                    ??????&nbsp;
                                           <span className="accumulate_price">
                                    {Math.round(product.price * user.grade.accumulationPercent)}
                                               ??? ??????
                                    </span>
                                </span>
                                   </div>
                           }
                        </span>
                    </div>
                    <div className="product_detail_info">
                        <dl className="sales_Unit">
                            <dt>????????????</dt>
                            <dd>{product.salesUnit}</dd>
                        </dl>
                        <dl className="list">
                            <dt>??????/??????</dt>
                            <dd>{product.capacity}</dd>
                        </dl>
                        <dl className="list">
                            <dt>????????????</dt>
                            <dd>{product.deliveryType}</dd>
                        </dl>
                        <dl className="list">
                            <dt>????????????</dt>
                            <dd>
                                <div className="type">
                                    {product.package.packType}
                                </div>
                                <span className="pack_message">
                                    {product.package.message}
                                </span>
                            </dd>
                        </dl>
                        <dl className="sales_Unit">
                            <dt>????????????</dt>
                            <dd className="amount_sale">
                                <AmountButton
                                    className="product-cart-modal--price-amount"
                                    amount={amount}
                                    plus={() => setAmount(amount + 1)}
                                    minus={() => amount > 0 && setAmount(amount - 1)}
                                />
                            </dd>
                        </dl>
                    </div>
                    <div className="buy_info">
                        <div className="tit_buy">
                            <span className="total_price_ment">??? ???????????? : </span>
                            <span className="total_price">{(Math.round(product.price * amount)).toLocaleString()}
                            </span>
                            <span className="won">???</span>
                            <div className="cart_button">
                                <div className="point_txt">
                                        <span className="icon">
                                            <span className="accumulate-icon">??????</span>
                                        </span>
                                    <span>
                                        {
                                            checkObjectIsEmpty(user) ?
                                                <span className="accumulate-ment">
                                                    ????????? ???, ???????????? ??????
                                                </span>
                                                :
                                                <span>
                                                <span className="accumulate-ment">?????? ???</span> &nbsp;
                                                    <span className="total-accumulate-price">
                                                    {Math.round((product.price * user.grade.accumulationPercent) * amount)}??? ??????
                                                </span>
                                            </span>
                                        }
                                        </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="total_button">
                        <div className="button_list">
                            <div className="heart">
                                <button onClick={() => setGym(!gym)}>
                                    <img
                                        src={gym ? "https://res.kurly.com/pc/service/pick/btn-itemdetail-like-on.svg" : "https://res.kurly.com/pc/service/pick/btn-itemdetail-like.svg"}
                                        alt="gym"/>
                                </button>

                            </div>
                            <div className="bell">
                                <button>
                                    <img src="https://res.kurly.com/pc/service/goodsview/btn-itemdetail-restock-dim.svg"
                                         alt="bell"/>
                                </button>
                            </div>
                        </div>
                        <div className="cart_button">
                            <button
                                className="product-cart-modal--button-put-to-cart"
                                onClick={putProductToCart}
                            >???????????? ??????
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
