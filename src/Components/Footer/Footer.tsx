import styled from "styled-components";

const Foot = styled.footer`
  margin-top: 200px;
  height: 200px;
  bottom: 0;
  padding-bottom: 30px;
  width: 100%;
  display: flex;
  align-items: end;
  justify-content: center;
  font-size: 11px;
  color: grey;
`;

const Github = styled.a`
  text-decoration: none;
`;
const Desc = styled.div`
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  gap: 10px;
`;

export default function Footer() {
  return (
    <Foot className="footer">
      <div className="logos"></div>
      <Desc>
        <p>
          <span>Netflix Clone Coding Project - 2022</span>
        </p>
        <p>
          <span>개발 : 리기훈 @kylelee-js</span>
        </p>
        <p>
          <span>찾아오시는 길 : 서울특별시 중랑구 중랑역로 276-8</span>
        </p>
        <p>
          <span>
            <Github href="https://github.com/kylelee-js/Netflix">
              Github : https://github.com/kylelee-js/Netflix
            </Github>
          </span>
        </p>
        <p>
          <Github href="https://velog.io/@whzjqkrtm12">
            Velog : https://velog.io/@whzjqkrtm12
          </Github>
        </p>
      </Desc>
    </Foot>
  );
}
