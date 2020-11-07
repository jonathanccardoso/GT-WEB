import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";

import * as Styled from "./styled";

import Layout from "../../components/Layout";
import CardMilestoneList from "../../components/CardMilestoneList";
import Modal from "../../components/Modal";

import { useAuth } from "../../contents/auth";

import api from "../../services/api";

import { ReactComponent as Remove } from "../../assets/icons/close.svg";
import { ReactComponent as Plus } from "../../assets/icons/plus.svg";
import { ReactComponent as Edit } from "../../assets/icons/edit.svg";
import { ReactComponent as Message } from "../../assets/icons/message-circle.svg";

function SubjectDetail() {
  const { signed, loading } = useAuth();

  const [show, setShow] = useState(false);
  const [showStudent, setShowStudent] = useState(false);

  //student
  const [students, setStudents] = useState([]);
  const [studentActive, setStudentActive] = useState("");

  //subject
  const [subjectName, setSubjectName] = useState("");

  //milestone
  const [milestones, setMilestones] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    if (loading === false) {
      if (signed === false) {
        history.push("/signin");
      } else {
        api.get("/subject").then(function (res) {
          res.data.map((item) => {
            if (item.id === id) {
              setSubjectName(item.name);
              setStudents(item.students);
            }
          });
        });

        api.get("/milestone").then(function (res) {
          setMilestones(res.data);
        });
      }
    }
  }, [signed, history, milestones, students, loading]);

  function handleMilestoneModal(e) {
    setShow(!show);
  }
  function handleStudentModal(student_id) {
    setShowStudent(!showStudent);
    setStudentActive(student_id);
  }

  async function handleRemoveStudent(e) {
    e.preventDefault();

    await api({
      method: "delete",
      url: "/subject/student/",
      data: {
        subject_id: id,
        student_id: studentActive,
      },
    })
      .then(function (res) {
        setShowStudent(!showStudent);
        setStudentActive("");
      })
      .catch(function (error) {
        console.log(error, "Error Student on Subject error!");
      });
  }

  async function handleCreateMilestone(e) {
    e.preventDefault();

    await api
      .post("/milestone", {
        name,
        description,
      })
      .then(function (res) {
        console.log(res.data, "Create Milestone ok!");

        setShow(!show);
        setName("");
        setDescription("");
      })
      .catch(function (error) {
        console.log(error, "Error Milestone error!");
      });
  }

  return (
    <Layout pageTitle="Disciplinas">
      <Styled.MenuWrapper>
        <div>
          <h1>ALUNOS</h1>
          <span>{students.length}</span>
        </div>

        {students.map((item) => (
          <div key={item.id}>
            <div>
              <Styled.CircleProfile />
              <span>Name</span>
            </div>
            <div>
              <button onClick={() => handleStudentModal(item.id)}>
                <Remove />
              </button>
              <button>
                <Message />
              </button>
            </div>
          </div>
        ))}
      </Styled.MenuWrapper>
      <Styled.SubjectWrapper>
        <div>
          <h1>Detalhes</h1>
          <div>
            <button onClick={handleMilestoneModal}>
              <Plus />
            </button>
            <button>
              <Edit />
            </button>
          </div>
        </div>

        <div>
          <h2>{subjectName}</h2>
        </div>

        <Styled.MilestoneWrapper>
          {/* milestones.map */}
          {[0, 1, 2, 3].map((item) => (
            <Link key={item.id} to={`/milestone/${item.id}`}>
              <CardMilestoneList
                number={item}
                name="Introdução"
                deadline="Termina em 11/06/20"
                percentage="55"
              />
            </Link>
          ))}
        </Styled.MilestoneWrapper>
      </Styled.SubjectWrapper>

      <Modal onClose={handleStudentModal} show={showStudent}>
        <form onSubmit={handleRemoveStudent}>
          <h2>Remover Aluno</h2>
          <p>Deseja realmente resolver o aluno da disciplina?</p> <br />
          <br />
          <div>
            <button onClick={handleStudentModal}>Cancelar</button>
            <button type="submit">Confirmar</button>
          </div>
        </form>
      </Modal>

      <Modal onClose={handleMilestoneModal} show={show}>
        <form onSubmit={handleCreateMilestone}>
          <h2>Adicionar Marco</h2>

          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            placeholder="Nome do marco"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="description">Descrição</label>
          <textarea
            type="text"
            id="description"
            placeholder="Escreva aqui..."
            rows="5"
            cols="33"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div>
            <button onClick={handleMilestoneModal}>Cancelar</button>
            <button type="submit">Continuar</button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

export default SubjectDetail;
