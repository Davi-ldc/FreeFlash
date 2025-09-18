interface FooterProps {
  vite_js: string
}

const Footer = ({ vite_js }: FooterProps) => {
  return (
    <>
      <footer class="footer"></footer>
      <script type="module" src={vite_js}></script>
    </>
  )
}

export default Footer
