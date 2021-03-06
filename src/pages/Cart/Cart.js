import "./Cart.scss";
import {useContext, useEffect, useState} from "react";
import {CartContext, UserContext} from "../../App";
import CartProductType from "../../components/Cart/CartProductType/CartProductType";
import SelectAll from "../../components/Cart/SelectAll/SelectAll";
import typeData from "./typeData.json";
import Button from "../../components/Button/Button";
import {Link} from "react-router-dom";
import {checkObjectIsEmpty} from "../../utils/checkObjectIsEmpty";

export default function Cart() {

    const {cart, setCart} = useContext(CartContext);
    const {user} = useContext(UserContext);

    const [checkedItemCount, setCheckedItemCount] = useState(cart.length);
    const [allChecked, setAllChecked] = useState(true);
    const [totalPrice, setTotalPrice] = useState({
        itemSum: 0,
        discountSum: 0,
        accumulationSum: 0,
        delivery: 0,
        totalPrice: 0,
    });

    const toggleAllCheck = () => {
        let checkAllCart = [...cart];
        checkAllCart.forEach(c => c.isChecked = !allChecked);
        setAllChecked(!allChecked);
        setCart(checkAllCart);
    }

    const deleteCheckedItem = () => {
        setCart(cart.filter(c => !c.isChecked));
    }

    useEffect(() => setCheckedItemCount(cart.filter(c => c.isChecked).length), [cart]);
    useEffect(() => setAllChecked(checkedItemCount === cart.length), [checkedItemCount]);

    useEffect(() => {
        let tempTotalPrice = {
            itemSum: 0,
            discountSum: 0,
            accumulationSum: 0,
            delivery: 0,
            totalPrice: 0,
        };

        let accumulationPercent = checkObjectIsEmpty(user) ? 0 : user.grade.accumulationPercent;
        const checkedItem = cart.filter(c => c.isChecked);

        for (let i of checkedItem) {
            if (i.product.isDiscount) {
                tempTotalPrice.itemSum += i.amount * i.product.priceBeforeDiscount;
                if (!checkObjectIsEmpty(user)) tempTotalPrice.discountSum += i.amount * (i.product.price - i.product.priceBeforeDiscount);
            } else {
                tempTotalPrice.itemSum += i.amount * i.product.price;
            }

            if (i.product.isAccumulate) tempTotalPrice.accumulationSum += i.product.price * i.amount;
        }

        if (tempTotalPrice.itemSum > 0 && tempTotalPrice.itemSum + tempTotalPrice.discountSum < 40000) tempTotalPrice.delivery = 3000;
        tempTotalPrice.totalPrice = tempTotalPrice.itemSum + tempTotalPrice.discountSum + tempTotalPrice.delivery
        tempTotalPrice.accumulationSum = Math.round(tempTotalPrice.accumulationSum * accumulationPercent);
        setTotalPrice(tempTotalPrice)
    }, [cart]);

    useEffect(() => {
        let checkAllCart = [...cart];
        checkAllCart.forEach(c => c.isChecked = true);
        setCart(checkAllCart);
    }, [])

    return (
        <section>
            <div className="cart-section-inner">
                <h3 className="title">????????????</h3>

                <div className="cart-section-content">
                    <div className="cart-item">
                        <SelectAll
                            isChecked={allChecked}
                            toggleCheckAll={toggleAllCheck}
                            countIsChecked={checkedItemCount}
                            countAll={cart.length}
                            deleteCheckedItem={deleteCheckedItem}
                        />
                        <div className={`cart-item--select ${cart.length === 0 && "cart-item--is-empty"}`}>
                            {cart.length > 0 ?
                                <>
                                    {typeData.types.map(t => (
                                        <>
                                            <CartProductType
                                                type={t}
                                                content={cart.filter(c => c.product.type === t.type)}
                                            />
                                        </>
                                    ))}
                                </>
                                :
                                <p>??????????????? ?????? ????????? ????????????.</p>
                            }
                        </div>
                        <SelectAll
                            isChecked={allChecked}
                            toggleCheckAll={toggleAllCheck}
                            countIsChecked={checkedItemCount}
                            countAll={cart.length}
                            deleteCheckedItem={deleteCheckedItem}
                        />
                    </div>
                    <div className="cart-result">
                        <div className="cart-result-box">
                            <div className="cart-result-box--delivery">
                                <div className="cart-result-box--delivery-header">
                                    <span className="cart-result-box--delivery-icon"/>
                                    <span className="cart-result-box--delivery-text">?????????</span>
                                </div>
                                <div className="cart-result-box--delivery-content">
                                    {checkObjectIsEmpty(user) ?
                                        <>
                                            <span className="purple">???????????? ??????</span>?????? <br/>
                                            ??????????????? ????????? ?????????!
                                            <Link to="">
                                                <button className="cart-result-box--delivery-content-btn">
                                                    <span className="search-address"/>
                                                    ?????? ??????
                                                </button>
                                            </Link>
                                        </>
                                        :
                                        <>
                                            {user.delivery.address}
                                            <span
                                                className="cart-result-box--delivery-content-type">{user.delivery.type}</span>
                                            <Link to="">
                                                <button className="cart-result-box--delivery-content-btn">
                                                    ????????? ??????
                                                </button>
                                            </Link>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="cart-result-box--price">
                                <dl className="cart-result-box--price-price">
                                    <dt>????????????</dt>
                                    <dd>
                                        {(totalPrice.itemSum).toLocaleString()}
                                        <span className="won"> ???</span>
                                    </dd>
                                </dl>
                                <dl className="cart-result-box--price-price">
                                    <dt>??????????????????</dt>
                                    <dd>
                                        {(totalPrice.discountSum).toLocaleString()}
                                        <span className="won"> ???</span>
                                    </dd>
                                </dl>
                                {checkObjectIsEmpty(user) && cart.length > 0 &&
                                    <p className="more-description">????????? ??? ?????? ?????? ??????</p>
                                }
                                <dl className="cart-result-box--price-price">
                                    <dt>?????????</dt>
                                    <dd>
                                        {totalPrice.delivery > 0 && <>+</>}
                                        {(totalPrice.delivery).toLocaleString()}
                                        <span className="won"> ???</span>
                                    </dd>
                                </dl>
                                {totalPrice.delivery !== 0 &&
                                    <p className="more-description purple">{(43000 - totalPrice.totalPrice).toLocaleString()}???
                                        ???????????? ???, <span>????????????</span></p>
                                }
                                <dl className="cart-result-box--price-price price-total-result">
                                    <dt>??????????????????</dt>
                                    <dd>
                                        {(totalPrice.totalPrice).toLocaleString()}
                                        <span className="won"> ???</span>
                                    </dd>
                                </dl>
                                {cart.length > 0 &&
                                    <div className="cart-result-box--price-price-accumulation clear">
                                        <span className="badge">??????</span>
                                        {checkObjectIsEmpty(user) ?
                                            <>
                                                ????????? ??? ??????????????? ?????? ??????
                                            </>
                                            :
                                            <>
                                                ?????? ???
                                                <span className="bold"> {(totalPrice.accumulationSum).toLocaleString()}??? ??????</span>
                                            </>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                        <Button
                            className={`cart-result-order-button ${(cart.length === 0 || checkObjectIsEmpty(user) || checkedItemCount === 0) && "de-cart"}`}
                            color="purple"
                            willdo={() => console.log("??????X")}
                            text={cart.length > 0 ? checkObjectIsEmpty(user) ? "????????? ????????????" : checkedItemCount > 0 ? "????????????" : "????????? ??????????????????" : "????????? ???????????????"}
                        />
                        <div className="cart-result-notice">
                            {!checkObjectIsEmpty(user) &&
                                <div className="cart-result-notice--notice">
                                    <span className="cart-result-notice--notice-dot">??</span>
                                    <span className="cart-result-notice--notice-content">??????/???????????? ??????????????? ?????? ???????????????.</span>
                                </div>
                            }
                            <div className="cart-result-notice--notice">
                                <span className="cart-result-notice--notice-dot">??</span>
                                <span className="cart-result-notice--notice-content">[???????????????] ???????????? ?????? ?????? ???????????????.</span>
                            </div>
                            <div className="cart-result-notice--notice">
                                <span className="cart-result-notice--notice-dot">??</span>
                                <span className="cart-result-notice--notice-content">[???????????? > ???????????? ???????????????] ?????? ?????? ???????????? ??? ????????????.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
