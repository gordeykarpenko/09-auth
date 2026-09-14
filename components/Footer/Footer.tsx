import css from "./Footer.module.css";
const Footer = () => (
  <footer className={css.footer}>
    <div className={css.content}>
      <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
      <div className={css.wrap}>
        <p>Developer: Gordey Karpenko</p>
        <p>
          Contact us:{" "}
          <a href="mailto:student@notehub.app">student@notehub.app</a>
        </p>
      </div>
    </div>
  </footer>
);
export default Footer;
