import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import styles from './Footer.module.css';

const Footer = ({ darkMode }) => {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const heartBeat = {
    scale: [1, 1.2, 1],
    transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
  };

  return (
    <motion.footer
      className={`${styles.footer} ${darkMode ? styles.dark : styles.light}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.copyright}>
            &copy; {currentYear} All Rights Reserved
          </div>
          
          <motion.div 
            className={styles.madeWith}
            whileHover={{ scale: 1.05 }}
          >
            <span>Made with</span>
            <motion.span
              animate={heartBeat}
              className={styles.heartIcon}
            >
              <FaHeart />
            </motion.span>
            <span>by Danish</span>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;