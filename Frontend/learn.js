/**
 * Created by ������������� on 20.06.2015.
 */
it("PROTOTYPE_USER", function() {
  var x = new User({});
  expect(x.hasOwnProperty('save')).toBeFalsy();
  expect(x.hasOwnProperty('remove')).toBeFalsy();
  expect(User.prototype.hasOwnProperty('save')).toBeTruthy();
  expect(User.prototype.hasOwnProperty('remove')).toBeTruthy();
});
it("PROTOTYPE_ADMIN", function() {
  var x = new Admin({});
  expect(x.hasOwnProperty('save')).toBeFalsy();
  expect(x.hasOwnProperty('remove')).toBeFalsy();
  expect(Admin.prototype.hasOwnProperty('save')).toBeTruthy();
  expect(Admin.prototype.hasOwnProperty('remove')).toBeFalsy();
});


//����, � ��������� ������� ��� ���������� ������� ��� ��� ������ ������������� ����� save
//������ ��� ������ ��� ������� ���� ������ ������ �� /refreshAdmins?
//
//  � ������ ������������ ������� ����� �������������
//  [19:17:27] Illya Klymov: ��� ���������� �������������� ���� ���� ������ GET �� /refreshAdmins
//  [19:17:29] Illya Klymov: �
//  [19:17:34 | �������� 19:17:40] Illya Klymov: ��� �������v ���������� �������������� ���� ���� ������ GET �� /refreshAdmins

function Admin() {
  'use strict';
  User.apply(this, arguments);
}
Admin.prototype = Object.create(User.prototype);
Admin.prototype.save = function saveHelpAdmin(onComplete) {
  'use strict';
  var refreshUrl;
  this.role = 'Admin';
  refreshUrl = window.crudURL + '/refreshAdmins';
  doRequest('GET', refreshUrl, null, null);
  User.prototype.save.apply(this, [onComplete]);
};
