import React, { useState, useEffect } from "react";
import { getUsers } from "../api/apiCalls";
import { useTranslation } from "react-i18next";
import UserListItem from "./UserListItem";
import { useApiProgress } from "../shared/ApiProgress";
import Spinner from "./Spinner";

const UserList = () => {
  const [page, setPage] = useState({
    content: [],
    size: 3,
    page: 0,
    totalPages: 0,
  });

  const [loadFailure, setLoadFailure] = useState(false);

  const pendingApiCall = useApiProgress("get", "/api/1.0/users?page");

  useEffect(() => {
    loadUsers();
  }, []);

  const onClickNext = () => {
    const nextPage = page.page + 1;
    loadUsers(nextPage);
  };

  const onClickPrevious = () => {
    const previousPage = page.page - 1;
    loadUsers(previousPage);
  };

  const loadUsers = async (page) => {
    setLoadFailure(false);
    try {
      const response = await getUsers(page);
      setPage(response.data);
    } catch (error) {
      setLoadFailure(true);
    }
  };

  const { t } = useTranslation();
  const { content: users, page: currentPage, totalPages } = page;

  const first = currentPage === 0;
  const last = totalPages !== 0 ? currentPage === totalPages - 1 : true;

  let actionDiv = (
    <div>
      {first === false && (
        <button className="btn btn-sm btn-light" onClick={onClickPrevious}>
          {t("Previous")}
        </button>
      )}
      {last === false && (
        <button
          className="btn btn-sm btn-light float-right"
          onClick={onClickNext}
        >
          {t("Next")}
        </button>
      )}
    </div>
  );

  if (pendingApiCall) {
    actionDiv = <Spinner />;
  }

  let content = <div/>;
  if(pendingApiCall && users.length === 0) {
    content = <Spinner />;
  } else {
    content = users.length > 0 && (
      <div className="card">
        <h3 className="card-header text-center">{t("Users")}</h3>
        <div className="list-group-flush">
          {users.map((user) => (
            <UserListItem key={user.username} user={user} />
          ))}
        </div>
        {actionDiv}
        {loadFailure && (
          <div className="text-center text-danger">{t("Load Failure")}</div>
        )}
      </div>
    )
  }


  return (
    <div>
      {content}
    </div>
  );
};

export default UserList;
