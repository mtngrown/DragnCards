defmodule DragnCardsWeb.ReplayController do
  use DragnCardsWeb, :controller
  import Ecto.Query

  alias DragnCards.{Replay, Repo}

  # alias DragnCardsUtil.{NameGenerator, Slugify}
  # alias DragnCardsGame.GameSupervisor

  action_fallback DragnCardsWeb.FallbackController

  def index(conn, params) do
    user_id = params["user_id"]
    query = from(r in Replay, order_by: [desc: :updated_at], where: r.user == ^user_id)
    replays = Repo.all(query)
    #replays = Repo.all(Replay, user: params["user_id"])
    render(conn, "index.json", replays: replays)
  end

  # Create: Removed, users no longer able to create rooms by API
  # Possibly this entire controller should be removed

  # def show(conn, %{"id" => id}) do
  #   room = Rooms.get_room!(id)
  #   render(conn, "show.json", room: room)
  # end

  # def update(conn, %{"id" => id, "room" => room_params}) do
  #   room = Rooms.get_room!(id)

  #   with {:ok, %Room{} = room} <- Rooms.update_room(room, room_params) do
  #     render(conn, "show.json", room: room)
  #   end
  # end

  # def delete(conn, %{"id" => id}) do
  #   room = Rooms.get_room!(id)

  #   with {:ok, %Room{}} <- Rooms.delete_room(room) do
  #     send_resp(conn, :no_content, "")
  #   end
  # end
end
