import { motion } from "framer-motion";

const Food = (props) => {
    return (
        <div className="row align-items-center mt-5">
            <motion.div
                className="col-12 col-md-6 d-flex justify-content-center mb-4 mb-md-0"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ amount: 0.3 }}
            >
                <img src={props.img} className="img-fluid" style={{ maxWidth: 250 }} />
            </motion.div>

            <motion.div
                className="col-12 col-md-6 d-flex justify-content-center align-items-center flex-column text-center"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ amount: 0.3 }}
            >
                <h1 className="px-3" style={{ fontFamily: "'Century Gothic', sans-serif", fontSize: 24 }}>
                    {props.name}
                </h1>
            </motion.div>

        </div>
    );
};

export default Food