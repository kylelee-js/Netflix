import styled from "styled-components";

const Foot = styled.footer`
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

export default function Footer() {
  return (
    <Foot className="footer">
      <div className="logos"></div>
      <div className="description">
        <p>
          <span>영화 좋아 좋다 좋아</span>
        </p>
        <p>
          <span>대표 : 리기훈</span>
        </p>
        <p>
          <span>찾아오시는 길 : 서울특별시 중랑구 중랑역로 276-8</span>
        </p>
      </div>
    </Foot>
  );
}
