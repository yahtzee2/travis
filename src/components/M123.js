import React, { Component } from 'react';
// Styles
import logo from '../pic.gif';
import '../App.css'; // This uses CSS modules.
import {
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table
} from 'reactstrap';
import firebase from '../firebase'
const sub123_m123 = firebase.initializeApp({
  databaseURL: "https://regispromma-sub123.firebaseio.com/"
}, 'sub123_m123');
const subAll_m123 = firebase.initializeApp({
  databaseURL: "https://regispromma-all.firebaseio.com/"
}, 'subAll_m123');

class App extends Component {
  constructor() {
    super();
    this.state = {
      items_123: [],
      items_all: [],
      item_id: '',
      subjects: '',
      openSub: undefined,
      teacher: '',
      numStudents: '',
      detail: '',
      select: '',
      data: [],
      StatusSwitch: undefined,
      chack_input: undefined,
      loading: false,
      userStatus: 0
    }
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount() {
    var db = firebase.database();
    var db_sub123 = firebase.database(sub123_m123);
    var db_subAll = firebase.database(subAll_m123);
    var email = firebase.auth().currentUser.email;
    email = email.split('@');
    email = email[0]
    db.ref('M123/' + email).once('value', (snapshot) => {
      this.setState({
        data: snapshot.val()
      })
    })
    db.ref('M123/' + email + "/status").on('value', (snapshot) => {
      console.log(snapshot.val())
      this.setState({
        userStatus: snapshot.val()
      })
      console.log(this.state.userStatus)
    })
    db_sub123.ref('Sub123').on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        let Member = []
        if (items[item].Member != undefined) {
          for (let item1 in items[item].Member) {
            Member.push(item1)
          }
        }
        newState.push({
          item_id: item,
          openSub: items[item].openSub,
          subjects: items[item].subjects,
          teacher: items[item].teacher,
          detail: items[item].detail,
          class: items[item].class,
          max: items[item].max,
          count: Member.length
        })
      }
      newState.sort(function (a, b) {
        var nameA = a.subjects.toUpperCase(); // ignore upper and lowercase
        var nameB = b.subjects.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      this.setState({
        items_123: newState
      })
    })
    db_subAll.ref('SubAll').on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        let Member = []
        if (items[item].Member != undefined) {
          for (let item1 in items[item].Member) {
            Member.push(item1)
          }
        }
        newState.push({
          item_id: item,
          openSub: items[item].openSub,
          subjects: items[item].subjects,
          teacher: items[item].teacher,
          detail: items[item].detail,
          class: items[item].class,
          max: items[item].max,
          count: Member.length
        })
      }
      newState.sort(function (a, b) {
        var nameA = a.subjects.toUpperCase(); // ignore upper and lowercase
        var nameB = b.subjects.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      this.setState({
        items_all: newState
      })
    })
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  saveItem(item, sub) {
    this.setState({ loading: true });
    var db = firebase.database();
    var db_sub123 = firebase.database(sub123_m123);
    var db_subAll = firebase.database(subAll_m123);
    var email = firebase.auth().currentUser.email;
    email = email.split('@');
    email = email[0]
    if (sub == "Sub123") {
      db_sub123.ref(sub + "/" + item.item_id + "/Member").child(email).set({
        Name: this.state.data.name,
        number: this.state.data.เลขประจำตัว,
        classRoom: this.state.data.classRoom
      }, (error) => {
        if (error) {
          console.log("The write failed... : " + sub + "/" + item.item_id + "/Member")
        } else {
          db.ref('M123/' + email).update({
            status: item.subjects
          }, (error) => {
            if (error) {
              console.log("The write failed... : " + 'M123/' + email)
            } else {
              this.setState({ loading: false });
            }
          });
        }
      });

    }
    else if (sub == "SubAll") {
      db_subAll.ref(sub + "/" + item.item_id + "/Member").child(email).set({
        Name: this.state.data.name,
        number: this.state.data.เลขประจำตัว,
        classRoom: this.state.data.classRoom
      }, (error) => {
        if (error) {
          console.log("The write failed... : " + sub + "/" + item.item_id + "/Member")
        } else {
          db.ref('M123/' + email).update({
            status: item.subjects
          }, (error) => {
            if (error) {
              console.log("The write failed... : " + 'M123/' + email)
            } else {
              this.setState({ loading: false });
            }
          });
        }
      });
    }
  }
  removeItem(item, sub) {
    this.setState({ loading: true });
    var db = firebase.database();
    var db_sub123 = firebase.database(sub123_m123);
    var db_subAll = firebase.database(subAll_m123);
    var email = firebase.auth().currentUser.email;
    email = email.split('@');
    email = email[0]
    if (sub == "Sub123") {
      db_sub123.ref(sub + "/" + item.item_id + "/Member/" + email).remove();
      db.ref('M123/' + email).update({
        status: "0"
      }, (error) => {
        if (error) {
          console.log("The write failed... : " + 'M123/' + email)
        } else {
          this.setState({ loading: false });
        }
      });
    }
    else if (sub == "SubAll") {
      db_subAll.ref(sub + "/" + item.item_id + "/Member/" + email).remove();
      db.ref('M123/' + email).update({
        status: "0"
      }, (error) => {
        if (error) {
          console.log("The write failed... : " + 'M123/' + email)
        } else {
          this.setState({ loading: false });
        }
      });
    }
  }
  render() {
    const { loading } = this.state;
    return (
      <div className="app" >
        <Navbar style={{ backgroundColor: '#ffffffd7' }} expand="md">
          <NavbarBrand >PrommaRegis</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
            </Nav>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                ยินดีต้อนรับคุณ {firebase.auth().currentUser.email}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => firebase.auth().signOut()}>
                  ออกจากระบบ
               </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Collapse>
        </Navbar>
        <div className="text-center">
          <br></br>
          <br></br>
          <h2>ระบบลงทะเบียนชุมนุม ระดับชั้นมัธยมศึกษาตอนต้น</h2>
          <br></br>
        </div>
        <div className=" container ml-auto ">
          <h3 class="text-danger">หมายเหตุ</h3>
          <h5 class="text-danger">1. นักเรียนห้อง ม.1/7 ม.2/7 ม.3/7 สามารถเลือกชุมนุมของกลุ่มสาระวิทย์
          หรือกลุ่มสาระคณิตได้เท่านั้น </h5>
          <h5 class="text-danger">2. นักเรียน ม.2/4 เลือกชุมนุม PROMMA Discovery Club ยกเว้นนักเรียนความสามารถพิเศษ ดนตรี
           ศิลปะ เท่านั้น กีฬา</h5>
        </div>
        <div className="table80 mx-auto" style={{ marginTop: 40 }}>
          <Table className="table table-bordered table-striped">
            <thead>
              <tr className="thead-dark">
                <th width="20%">ชื่อชุมนุม</th>
                <th width="25%">ชื่อครูผู้สอน</th>
                <th width="32%">รายละเอียดเพิ่มเติม</th>
                <th width="6%">ระดับชั้น</th>
                <th width="6%">จำนวน</th>
                <th width="11%">ลงทะเบียน</th>
              </tr>
            </thead>
            {
              this.state.items_123.map((item) => {
                if (item.openSub == false && this.state.userStatus == 0) {
                  return (
                    <tr>
                      <td>{item.subjects}</td>
                      <td>{item.teacher}</td>
                      <td>{item.detail}</td>
                      <td>{item.class}</td>
                      <td>{item.count}/{item.max}</td>
                      <td><button className="btn btn-danger btn-sm" disabled >ปิดลงทะเบียน</button></td>
                    </tr>
                  );
                }
                else {
                  if (item.count < item.max && this.state.userStatus == 0) {
                    return (
                      <tr>

                        <td>{item.subjects}</td>
                        <td>{item.teacher}</td>
                        <td>{item.detail}</td>
                        <td>{item.class}</td>
                        <td>{item.count}/{item.max}</td>
                        <td><button ref="btn" className="btn btn-success btn-sm" onClick={() => this.saveItem(item, 'Sub123')} disabled={loading}>
                          {loading && <span>Loading...</span>}
                          {!loading && <span>ลงทะเบียน</span>}
                        </button></td>
                      </tr>
                    );
                  }
                  else if (this.state.userStatus == item.subjects) {
                    return (
                      <tr>
                        <td>{item.subjects}</td>
                        <td>{item.teacher}</td>
                        <td>{item.detail}</td>
                        <td>{item.class}</td>
                        <td>{item.count}/{item.max}</td>
                        <td><button ref="btn" className="btn btn-danger btn-sm" onClick={() => this.removeItem(item, 'Sub123')} disabled={loading}>
                          {loading && <span>Loading...</span>}
                          {!loading && <span>ยกเลิกลงทะเบียน</span>}
                        </button></td>
                      </tr>
                    );
                  }
                  else if (item.count >= item.max && this.state.userStatus == 0) {
                    return (
                      <tr>
                        <td>{item.subjects}</td>
                        <td>{item.teacher}</td>
                        <td>{item.detail}</td>
                        <td>{item.class}</td>
                        <td>{item.count}/{item.max}</td>
                        <td><button className="btn btn-secondary btn-sm" disabled >เต็ม</button></td>
                      </tr>
                    );
                  }
                }
              })
            }
            {

              this.state.items_all.map((item) => {
                if (item.openSub == false && this.state.userStatus == 0) {
                  return (
                    <tr>
                      <td>{item.subjects}</td>
                      <td>{item.teacher}</td>
                      <td>{item.detail}</td>
                      <td>{item.class}</td>
                      <td>{item.count}/{item.max}</td>
                      <td><button className="btn btn-danger btn-sm" disabled >ปิดลงทะเบียน</button></td>
                    </tr>
                  );
                }
                else {
                  if (item.count < item.max && this.state.userStatus == 0) {
                    return (
                      <tr>
                        <td>{item.subjects}</td>
                        <td>{item.teacher}</td>
                        <td>{item.detail}</td>
                        <td>{item.class}</td>
                        <td>{item.count}/{item.max}</td>
                        <td><button ref="btn" className="btn btn-success btn-sm" onClick={() => this.saveItem(item, 'SubAll')} disabled={loading}>
                          {loading && <span>Loading...</span>}
                          {!loading && <span>ลงทะเบียน</span>}
                        </button></td>
                      </tr>
                    );
                  }
                  else if (this.state.userStatus == item.subjects) {
                    return (
                      <tr>
                        <td>{item.subjects}</td>
                        <td>{item.teacher}</td>
                        <td>{item.detail}</td>
                        <td>{item.class}</td>
                        <td>{item.count}/{item.max}</td>
                        <td><button ref="btn" className="btn btn-danger btn-sm" onClick={() => this.removeItem(item, 'SubAll')} disabled={loading}>
                          {loading && <span>Loading...</span>}
                          {!loading && <span>ยกเลิกลงทะเบียน</span>}
                        </button></td>
                      </tr>
                    );
                  }
                  else if (item.count >= item.max && this.state.userStatus == 0) {
                    return (
                      <tr>
                        <td>{item.subjects}</td>
                        <td>{item.teacher}</td>
                        <td>{item.detail}</td>
                        <td>{item.class}</td>
                        <td>{item.count}/{item.max}</td>
                        <td><button className="btn btn-secondary btn-sm" disabled >เต็ม</button></td>
                      </tr>
                    );
                  }
                }
              })
            }
          </Table>
        </div>
      </div>
    );
  }
}
export default App;
