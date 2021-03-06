import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useAuth } from "../../contents/auth";
import api from "../../services/api";

import * as Styled from "./styled";

import { Col, Row } from "../../components/Grid/Index";
import { Header, Body } from "../../components/Modais/styled";

import Form from "../../components/Form/Index";
import {
  Text,
  Textarea,
  RadioGroup,
  Date,
  Badge,
} from "../../components/Inputs/Index";
import { ButtomBar, ButtomCTA } from "../../components/Buttons/Index";
import { InternModal } from "../../components/Modais";
import MilestoneCard from "../../components/MilestoneCard";

import Layout from "../../components/Layout";

import { AvatarLG } from "../../components/Avatar";
import { ReactComponent as Plus } from "../../assets/icons/plus.svg";
import { ReactComponent as Edit } from "../../assets/icons/edit.svg";
import { MessageSM } from "../../components/Icons";

function MilestoneList() {
  const { signed, loading } = useAuth();

  const [show, setShow] = useState(false);
  const [showStudent, setShowStudent] = useState(false);
  const [showTab, setShowTab] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [showBlock, setShowBlock] = useState(false);

  //student
  const [students, setStudents] = useState([]);
  const [studentActive, setStudentActive] = useState("");
  //const [studentEmail, setStudentEmail] = useState('');

  //subject
  const [subjectName, setSubjectName] = useState("");

  // subject class
  const [block, setBlock] = useState("");
  const [blocks, setBlocks] = useState([]);

  //milestone
  const [milestones, setMilestones] = useState([]);
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [milestoneActive, setMilestoneActive] = useState("");

  // task
  //const [tasks, setTasks] = useState([]);
  const [nameTask, setNameTask] = useState("");
  const [descriptionTask, setDescriptionTask] = useState("");
  const [dueTask, setDueTask] = useState("");
  const [selectMilestoneTask, setSelectMilestoneTask] = useState("");
  const [selectBlockTask, setSelectBlockTask] = useState("");

  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    if (loading === false) {
      if (signed === false) {
        history.push("/signin");
      } else {
        api.get("/subjects").then(function (res) {
          res.data.teacher_user.map((item) => {
            if (item.id === id) {
              setSubjectName(item.name);
              setStudents(item.students);
              setMilestones(item.milestones);
              localStorage.setItem(
                "@RNAuth:milestones",
                JSON.stringify(item.milestones)
              );
              localStorage.setItem(
                "@RNAuth:subject",
                JSON.stringify(item.name)
              );
              // JSON.stringify(item.milestones)
              // .push(item.name)

              item.milestones.map((item) => {
                return setBlocks(item.blocks);
              });
            }

            return null;
          });
        });
      }
    }

    // return;
    // }, [signed, history, milestones, students, loading]);
  }, [signed, history, loading, id]);

  function handleMilestoneModal(e) {
    setShow(!show);
  }
  function handleTaskModal(e) {
    setShowTask(!showTask);
  }
  function handleShowTab(e) {
    setShowTab(!showTab);
  }
  function handleBlockModal(e) {
    setShowBlock(!showBlock);
  }

  function handleStudentModal(student_id) {
    setShowStudent(!showStudent);
    setStudentActive(student_id);
  }

  console.log(handleShowTab);

  // adds student on subject
  /* async function handleAddStudent(e) {
    e.preventDefault();

    await api
      .post('/subjects/students/email', {
        subject_id: id,
        student_email: studentEmail,
      })
      .then(function (res) {
        console.log(res, 'add Student on Subject ok!');
      })
      .catch(function (error) {
        console.log(error, 'Error Student on Subject error!');
      });
  } */

  async function handleRemoveStudent(e) {
    e.preventDefault();

    await api({
      method: "delete",
      url: "/subjects/students/",
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
      .post("/subjects/milestones", {
        subject_id: id,
        name,
        description,
        deadline,
        isVisible: visibility,
      })
      .then(function (res) {
        console.log(res.data, "Create Milestone ok!");

        setShow(!show);
        setNameTask("");
        setDescriptionTask("");
        setDueTask("");
        setSelectMilestoneTask("");
        setMilestoneActive(res.data.id);

        setShowBlock(!showBlock);
      })
      .catch(function (error) {
        console.log(error, "Error Milestone error!");
      });
  }

  async function handleMilestoneBlock(e) {
    e.preventDefault();

    let blocks = block.split(";");
    await blocks.map((item) => {
      api
        .post("/subjects/blocks", {
          name: item.trim(),
          subject_id: id,
          milestone_id: milestoneActive,
        })
        .then(function (res) {
          console.log(res, "add Block ok!");
          // setLink("");
          // setStudents("");
          setMilestoneActive("");

          setShowBlock(!showBlock);
        })
        .catch(function (error) {
          console.log(error, "Error Block error!");
        });

      return null;
    });
  }

  async function handleCreateTask(e) {
    e.preventDefault();

    await api
      .post("/subjects/tasks", {
        name: nameTask,
        description: descriptionTask,
        due: dueTask,
        subject_id: id,
        block_id: selectBlockTask,
        // milestone_id: selectMilestoneTask,
      })
      .then(function (res) {
        console.log(res.data, "Create Task ok!");

        setShowTask(!showTask);
        setName("");
        setDescription("");
      })
      .catch(function (error) {
        console.log(error, "Error Task error!");
      });
  }

  return (
    <Layout pageTitle="Marcos">
      <Styled.PageWrapper>
        <Row>
          <Col>
            <Styled.ActionBar>
              <div>
                <Styled.Link selected>Detalhes</Styled.Link>
                <Styled.Link>Avisos</Styled.Link>
              </div>
              <Styled.ActionButtons>
                <button onClick={handleMilestoneModal}>
                  <Plus />
                </button>
                <button>
                  <Edit />
                </button>
              </Styled.ActionButtons>
            </Styled.ActionBar>
          </Col>
        </Row>

        <Row>
          <Col lg={3} md={4} sm={3} xs={3}>
            {/* <Styled.MenuWrapper>
              <h3>Ranking</h3>

              {students.map((item) => (
                <Styled.Profile key={item.id}>
                  <AvatarLG />
                  <p>{item.name}</p>
                </Styled.Profile>
              ))}
            </Styled.MenuWrapper> */}

            <Styled.MenuWrapper>
              <Styled.Flex>
                <h3>Alunos</h3>
                <h3>{students.length}</h3>
              </Styled.Flex>

              {students?.map((item) => (
                <Styled.ProfileWithButton key={item.id}>
                  <Styled.Profile>
                    <AvatarLG />
                    <p>{item.name}</p>
                  </Styled.Profile>
                  <button onClick={() => handleStudentModal(item.id)}>
                    <MessageSM />
                  </button>
                </Styled.ProfileWithButton>
              ))}
            </Styled.MenuWrapper>
          </Col>

          <Col lg={8}>
            <Styled.SubjectName>{subjectName}</Styled.SubjectName>
            {milestones?.length !== 0 ? (
              <>
                <Styled.ProgressBar>
                  <Styled.Flex>
                    <p>
                      Marco {milestones[milestones.length - 1].index} -
                      {milestones[milestones.length - 1].name}
                    </p>
                    <span>
                      {parseInt(milestones[milestones.length - 1].progress)}%
                      Completo
                    </span>
                  </Styled.Flex>
                  <Styled.Percentage
                    percentage={parseInt(
                      milestones[milestones.length - 1].progress
                    )}
                  />
                </Styled.ProgressBar>
                <Styled.ContentWrapper>
                  {milestones
                    ?.slice(0)
                    .reverse()
                    .map((item, index) => (
                      <Link
                        key={item.id}
                        to={item.isVisible ? `/milestone/${item.id}` : false}
                      >
                        <MilestoneCard
                          number={index + 1}
                          name={item.name}
                          deadline={item.deadline}
                          visibility={item.isVisible}
                          percentage={parseInt(item.progress)}
                        />
                      </Link>
                    ))}
                </Styled.ContentWrapper>
              </>
            ) : (
              <Styled.NewMilestone>
                Parece que nao tem nada aqui por enquanto.
                <Link>Adicionar um marco?</Link>
              </Styled.NewMilestone>
            )}
          </Col>
        </Row>
      </Styled.PageWrapper>

      <InternModal onClose={handleStudentModal} show={showStudent}>
        <Header>
          <h1>Remover Aluno</h1>
        </Header>
        <Body>
          <Form onSubmit={handleRemoveStudent}>
            <p>Deseja realmente resolver o aluno da disciplina?</p> <br />
            <br />
            <ButtomBar>
              <ButtomCTA secondary onClick={handleStudentModal}>
                Cancelar
              </ButtomCTA>
              <ButtomCTA type="submit">Confirmar</ButtomCTA>
            </ButtomBar>
          </Form>
        </Body>
      </InternModal>

      <InternModal onClose={handleMilestoneModal} show={show}>
        <Header>
          <h1>Adicionar Marco</h1>
        </Header>
        <Body>
          <Form onSubmit={handleCreateMilestone}>
            <Text
              type="text"
              id="name"
              placeholder="Titulo do marco"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            >
              T??tulo
            </Text>

            <Date
              name="deadline"
              defaultValue={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            >
              Prazo de conclus??o
            </Date>

            <Textarea
              type="text"
              id="description"
              placeholder="Escreva aqui..."
              rows="5"
              cols="33"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            >
              Descri????o
            </Textarea>

            <span>Vis??vel para os alunos</span>
            <RadioGroup>
              <input
                type="radio"
                id="yes"
                name="visible"
                defaultValue={visibility}
                onChange={(e) => setVisibility(true)}
              />
              <label htmlFor="yes">Sim</label>

              <input
                type="radio"
                id="no"
                name="visible"
                defaultValue={visibility}
                onChange={(e) => setVisibility(false)}
              />
              <label htmlFor="no">N??o</label>
            </RadioGroup>

            <ButtomBar>
              <ButtomCTA onClick={handleMilestoneModal}>Cancelar</ButtomCTA>
              <ButtomCTA type="submit">Continuar</ButtomCTA>
            </ButtomBar>
          </Form>
        </Body>
      </InternModal>

      <InternModal onClose={handleBlockModal} show={showBlock}>
        <Header>
          <h1>Adicionar Blocos</h1>
        </Header>
        <Body>
          <Form onSubmit={handleMilestoneBlock}>
            <Badge
              id="blocks"
              name="blocks"
              placeholder="Nome da Bloco;"
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              required
            >
              Insira o nome do bloco
            </Badge>

            <ButtomBar>
              <ButtomCTA onClick={handleBlockModal}>Pular</ButtomCTA>
              <ButtomCTA type="submit">Concluir</ButtomCTA>
            </ButtomBar>
          </Form>
        </Body>
      </InternModal>

      <InternModal onClose={handleTaskModal} show={showTask}>
        <Header>
          <h1>Adicionar Atividade</h1>
        </Header>
        <Body>
          <Form onSubmit={handleCreateTask}>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              placeholder="Nome da atividade"
              value={nameTask}
              onChange={(e) => setNameTask(e.target.value)}
              required
            />

            <label htmlFor="description">Descri????o</label>
            <textarea
              type="text"
              id="description"
              placeholder="Escreva aqui..."
              rows="5"
              cols="33"
              value={descriptionTask}
              onChange={(e) => setDescriptionTask(e.target.value)}
              required
            />

            <label htmlFor="milestone">Marco</label>
            <select
              name="select"
              id="milestone"
              value={selectMilestoneTask}
              onChange={(e) => setSelectMilestoneTask(e.target.value)}
              required
            >
              <option value="" selected>
                Selecione um marco
              </option>
              {milestones.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <label htmlFor="milestone">Bloco</label>
            <select
              name="select"
              id="milestone"
              value={selectBlockTask}
              onChange={(e) => setSelectBlockTask(e.target.value)}
              required
            >
              <option value="" selected>
                Selecione um bloco
              </option>
              {blocks.map((item) => (
                <option key={item} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <label htmlFor="due">Prazo</label>
            <input
              type="date"
              name="due"
              id="due"
              value={dueTask}
              onChange={(e) => setDueTask(e.target.value)}
              required
            />

            <ButtomBar>
              <ButtomCTA onClick={handleTaskModal}>Cancelar</ButtomCTA>
              <ButtomCTA type="submit">Continuar</ButtomCTA>
            </ButtomBar>
          </Form>
        </Body>
      </InternModal>

      <InternModal onClose={handleTaskModal} show={showTask}>
        <Header>
          <h1>Editar Marco</h1>
        </Header>
        <Body>
          <Form onSubmit={() => {}}>
            <Text
              type="text"
              id="title"
              placeholder="Nome da Disciplina"
              value={nameTask}
              onChange={(e) => setNameTask(e.target.value)}
              required
            >
              T??tulo
            </Text>

            <Textarea
              type="text"
              id="description"
              placeholder="Escreva aqui..."
              rows="5"
              cols="33"
              value={descriptionTask}
              onChange={(e) => setDescriptionTask(e.target.value)}
              required
            >
              Descri????o
            </Textarea>

            <span>Vis??vel para os alunos</span>
            <RadioGroup>
              <input
                type="radio"
                id="yes"
                name="visible"
                defaultValue={visibility}
                onChange={(e) => setVisibility(true)}
              />
              <label htmlFor="yes">Sim</label>

              <input
                type="radio"
                id="no"
                name="visible"
                defaultValue={visibility}
                onChange={(e) => setVisibility(true)}
              />
              <label htmlFor="no">N??o</label>
            </RadioGroup>

            <ButtomBar>
              <ButtomCTA onClick={handleTaskModal}>Cancelar</ButtomCTA>
              <ButtomCTA type="submit">Salvar</ButtomCTA>
            </ButtomBar>
          </Form>
        </Body>
      </InternModal>

      <InternModal>
        <Header>
          <h1>Excluir Marco</h1>
        </Header>

        <Body>
          <Form onSubmit={() => {}}>
            <span>
              Cuidado! Essa ?? uma a????o permanente, para confirmar a exclus??o do
              marco Introdu????o digite abaixo o nome do marco:
            </span>

            <Text
              name="name"
              value={name}
              placeholder="Digite o nome do marco"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <ButtomBar>
              <ButtomCTA secondary>Cancelar</ButtomCTA>
              <ButtomCTA danger type="submit">
                Excluir
              </ButtomCTA>
            </ButtomBar>
          </Form>
        </Body>
      </InternModal>
    </Layout>
  );
}
export default MilestoneList;
